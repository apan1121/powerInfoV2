(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        define(['d3'], factory);
    } else {
        root.Sunburst = factory(root.d3);
    }
}(this, (d3) => {
    const defaultOptions = {
        // DOM Selectors
        selectors: {
            breadcrumbs: '#sunburst-breadcrumbs',
            chart: '#sunburst-chart',
            description: '#sunburst-description',
            legend: '#sunburst-legend',
        },

        // Dimensions of sunburst.
        width: -1,
        height: -1,

        // Mapping of step names to colors.
        colors: {},

        // If a color-name is missing this color-scale is used
        colorScale: d3.scaleOrdinal(d3.schemeCategory10),
        colorScaleLength: 20,

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        breadcrumbs: {
            w: 75,
            h: 30,
            s: 3,
            t: 10,
        },

        // parser settings
        separator: '-',
        breadcrumbs_callback: null,
    };

    /**
	 * This hashing function returns a number between 0 and 4294967295 (inclusive) from the given string.
	 * @see https://github.com/darkskyapp/string-hash
	 * @param {String} str
	 */
    function hash(str){
        let hash = 5381;
        let i = str.length;
        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        return hash >>> 0;
    }

    const Sunburst = function(options, data){
        this.opt = Object.assign({}, defaultOptions, options);

        // Total size of all segments; we set this later, after loading the data.
        this.totalSize = 0;

        if (data) {
            this.setData(data);
        }
    };

    Sunburst.prototype.getColorByName = function(name){
        return this.opt.colors[name] || this.opt.colorScale(hash(name) % this.opt.colorScaleLength);
    };

    Sunburst.prototype.setData = function(data){
        const json = this.buildHierarchy(data);
        this.createVisualization(json);
    };

    Sunburst.prototype.loadCsv = function(csvFile){
        // Use d3.text and d3.csv.parseRows so that we do not need to have a header
        // row, and can receive the csv as an array of arrays.
        d3.text(csvFile).then((text) => {
            const array = d3.csvParseRows(text);
            const json = this.buildHierarchy(array);
            this.createVisualization(json);
        });
    };

    Sunburst.prototype.loadJson = function(jsonFile){
        d3.json(jsonFile).then((json) => {
            this.createVisualization(json);
        });
    };

    // Main function to draw and set up the visualization, once we have the data.
    Sunburst.prototype.createVisualization = function(json){
        const chartBox = document.querySelector('#sunburst-chart');

        if (this.opt.width < 0) {
            this.opt.width = chartBox.offsetWidth;
        }
        if (this.opt.height < 0) {
            this.opt.height = chartBox.offsetHeight;
        }


        const that = this;
        const radius = Math.min(this.opt.width, this.opt.height) / 2;

        d3.select(this.opt.selectors.chart).select('svg').remove();
        this.vis = d3.select(this.opt.selectors.chart).append('svg:svg')
            .attr('width', this.opt.width)
            .attr('height', this.opt.height)
            .append('svg:g')
            .attr('id', 'sunburst-container')
            .attr('transform', `translate(${this.opt.width / 2},${this.opt.height / 2})`);

        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => Math.sqrt(d.y0))
            .outerRadius(d => Math.sqrt(d.y1));

        const root = d3.hierarchy(json)
            .sum(d => d.size);

        const partition = d3.partition()
            .size([2 * Math.PI, radius * radius]);

        partition(root);

        // Basic setup of page elements.
        this.initializeBreadcrumbTrail();
        this.drawLegend();

        // For efficiency, filter nodes to keep only those large enough to see.
        const nodes = root.descendants()
            .filter(d => (d.x1 - d.x0 > 0.001), // 0.005 radians = 0.29 degrees
            );

        const all = this.vis.data([json])
            .selectAll('path')
            .data(nodes)
            .enter();

        all.append('svg:path')
            .attr('display', d => (d.depth ? null : 'none'))
            .attr('d', arc)
            .attr('fill-rule', 'evenodd')
            .style('fill', d => that.getColorByName(d.data.name))
            .style('opacity', 1)
            .on('mouseover', that.mouseover.bind(this));

        // some tests with text

        // Add the mouseleave handler to the bounding circle.
        // d3.select(this.opt.selectors.chart).on('mouseleave', that.mouseleave.bind(this));

        // Get total size of the tree = value of root node from partition.
        const node = all.node();
        this.totalSize = node ? node.__data__.value : 0;

        d3.select(this.opt.selectors.description).on('dblclick', that.resetDescription.bind(this));

        that.resetDescription.bind(this)();
    };

    Sunburst.prototype.resetDescription = function(){
        const percentage = (100 * this.totalSize / this.totalSize).toPrecision(3);
        // const sequenceArray = this.getAncestors(d);
        this.updateDescription([], this.totalSize, percentage);

        if (typeof this.opt.breadcrumbs_callback === 'function') {
            const breadcrumbs = [{
                name: '全部',
                value: this.totalSize,
                color: this.getColorByName(''),
            }];
            this.opt.breadcrumbs_callback(breadcrumbs, this.totalSize, percentage);
        }
    };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    Sunburst.prototype.mouseover = function(event, d){
        if (!d) return;

        const percentage = (100 * d.value / this.totalSize).toPrecision(3);
        const sequenceArray = this.getAncestors(d);

        this.updateDescription(sequenceArray, d.value, percentage);
        this.updateBreadcrumbs(sequenceArray, d.value, percentage);

        // Fade all the segments.
        this.vis.selectAll('path')
            .style('opacity', 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        this.vis.selectAll('path')
            .filter(node => (sequenceArray.indexOf(node) >= 0))
            .style('opacity', 1);
    };

    // Restore everything to full opacity when moving off the visualization.
    Sunburst.prototype.mouseleave = function(d){
        const that = this;

        // Hide the breadcrumb trail
        d3.select(this.opt.selectors.breadcrumbs).select('#trail')
            .style('visibility', 'hidden');

        // Deactivate all segments during transition.
        this.vis.selectAll('path').on('mouseover', null);

        // Transition each segment to full opacity and then reactivate it.
        // TODO cancel this transition on mouseover
        this.vis.selectAll('path')
            .transition()
            .duration(1000)
            .style('opacity', 1)
            .on('end', function(){
                d3.select(this).on('mouseover', that.mouseover.bind(that));
            });

        d3.select(this.opt.selectors.description)
            .style('visibility', 'hidden');
    };

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    Sunburst.prototype.getAncestors = function(node){
        const path = [];
        let current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };

    Sunburst.prototype.initializeBreadcrumbTrail = function(){
        // Add the svg area.
        const trail = d3.select(this.opt.selectors.breadcrumbs).append('svg:svg')
            .attr('width', this.opt.width)
            .attr('height', 50)
            .attr('id', 'trail');
        // Add the label at the end, for the percentage.
        trail.append('svg:text')
            .attr('id', 'endlabel')
            .style('fill', '#000');
    };

    // Generate a string that describes the points of a breadcrumb polygon.
    Sunburst.prototype.breadcrumbPoints = function(d, i){
        const points = [];
        const b = this.opt.breadcrumbs;

        points.push('0,0');
        points.push(`${b.w},0`);
        points.push(`${b.w + b.t},${b.h / 2}`);
        points.push(`${b.w},${b.h}`);
        points.push(`0,${b.h}`);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(`${b.t},${b.h / 2}`);
        }
        return points.join(' ');
    };

    // format the description string in the middle of the chart
    Sunburst.prototype.formatDescription = function(sequence, value, percentage){
        return percentage < 0.1 ? '< 0.1%' : `${percentage}%`;
    };

    Sunburst.prototype.updateDescription = function(sequence, value, percentage){
        d3.select(this.opt.selectors.description)
            .html(this.formatDescription(sequence, value, percentage))
            .style('visibility', '');
    };

    // format the text at the end of the breadcrumbs
    Sunburst.prototype.formatBreadcrumbText = function(sequence, value, percentage){
        return `${value} (${percentage < 0.1 ? '< 0.1%' : `${percentage}%`})`;
    };

    // Update the breadcrumb trail to show the current sequence and percentage.
    Sunburst.prototype.updateBreadcrumbs = function(sequence, value, percentage){
        const that = this;
        const b = this.opt.breadcrumbs;

        // Data join; key function combines name and depth (= position in sequence).
        const g = d3.select('#trail')
            .selectAll('g')
            .data(sequence, d => d.data.name + d.depth);

        // Add breadcrumb and label for entering nodes.
        const entering = g.enter().append('svg:g');

        entering.append('svg:polygon')
            .attr('points', this.breadcrumbPoints.bind(that))
            .style('fill', d => that.getColorByName(d.data.name));

        entering.append('svg:text')
            .attr('x', (b.w + b.t) / 2)
            .attr('y', b.h / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => d.data.name);

        // Set position for entering and updating nodes.
        entering.attr('transform', (d, i) => `translate(${i * (b.w + b.s)}, 0)`);

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3.select(this.opt.selectors.breadcrumbs).select('#trail').select('#endlabel')
            .attr('x', (sequence.length + 1) * (b.w + b.s))
            .attr('y', b.h / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .html(this.formatBreadcrumbText(sequence, value, percentage));

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select(this.opt.selectors.breadcrumbs).select('#trail')
            .style('visibility', '');

        if (typeof this.opt.breadcrumbs_callback === 'function') {
            const breadcrumbs = sequence.map(item => ({
                name: item.data.name,
                value: item.value,
                color: that.getColorByName(item.data.name),
            }));

            this.opt.breadcrumbs_callback(breadcrumbs, value, percentage);
        }
    };

    Sunburst.prototype.drawLegend = function(){
        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        const li = {
            w: 75, h: 30, s: 3, r: 3,
        };

        const legend = d3.select(this.opt.selectors.legend).append('svg:svg')
            .attr('width', li.w)
            .attr('height', Object.keys(this.opt.colors).length * (li.h + li.s));

        const g = legend.selectAll('g')
            .data(Object.entries(this.opt.colors))
            .enter().append('svg:g')
            .attr('transform', (d, i) => `translate(0,${i * (li.h + li.s)})`);

        g.append('svg:rect')
            .attr('rx', li.r)
            .attr('ry', li.r)
            .attr('width', li.w)
            .attr('height', li.h)
            .style('fill', d => d[1]);

        g.append('svg:text')
            .attr('x', li.w / 2)
            .attr('y', li.h / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .text(d => d[0]);
    };

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    Sunburst.prototype.buildHierarchy = function(array){
        const root = { name: 'root', children: [] };
        for (let i = 0; i < array.length; i++) {
            const sequence = array[i][0];
            const size = +array[i][1];
            if (isNaN(size)) { // e.g. if this is a header row
                continue;
            }
            const parts = sequence.split(this.opt.separator);
            let currentNode = root;
            for (let j = 0; j < parts.length; j++) {
                const children = currentNode.children || [];
                const nodeName = parts[j];
                var childNode;
                if (j + 1 < parts.length) {
                    // Not yet at the end of the sequence; move down the tree.
                    let foundChild = false;
                    for (let k = 0; k < children.length; k++) {
                        if (children[k].name == nodeName) {
                            childNode = children[k];
                            foundChild = true;
                            break;
                        }
                    }
                    // If we don't already have a child node for this branch, create it.
                    if (!foundChild) {
                        childNode = { name: nodeName, children: [] };
                        children.push(childNode);
                    }
                    currentNode = childNode;
                } else {
                    // Reached the end of the sequence; create a leaf node.
                    childNode = { name: nodeName, size };
                    children.push(childNode);
                }
            }
        }
        return root;
    };

    return Sunburst;
}));
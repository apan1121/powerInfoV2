const { type } = require("jquery");

(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        define(['d3'], factory);
    } else {
        root.Sunburst = factory(root.d3);
    }
}(this, (d3) => {
    const defaultOptions = {
        progressBar: '#a0a0a0',
        progressBarBg: '#ddd',
        thickness: 10,
        duration: 900,
        callback: null,
    };

    const RadialProgressBar = function(selector, options){
        const that = this;
        this.opt = Object.assign({}, defaultOptions, options);
        const parent = d3.select(selector);
        const size = parent.node().getBoundingClientRect();
        const svg = parent.append('svg')
            .attr('width', size.width)
            .attr('height', size.height);
        const outerRadius = Math.min(size.width, size.height) * 0.45;
        const { thickness } = that.opt;
        this.value = 0;

        that.mainArc = d3.arc()
            .startAngle(0)
            .endAngle(Math.PI * 2)
            .innerRadius(outerRadius - thickness)
            .outerRadius(outerRadius);

        that.progressBarBg = svg.append('path')
            .attr('fill', that.opt.progressBarBg)
            .attr('style', 'transition: fill 3s;')
            // .attr('class', 'progress-bar-bg')
            .attr('transform', `translate(${size.width / 2},${size.height / 2})`)
            .attr('d', that.mainArc());


        that.mainArcPath = svg.append('path')
            // .attr('class', 'progress-bar')
            .attr('style', 'transition: fill 3s;')
            .attr('fill', that.opt.progressBar)
            .attr('transform', `translate(${size.width / 2},${size.height / 2})`);

        that.start = svg.append('circle')
            // .attr('class', 'progress-bar')
            .attr('fill', that.opt.progressBar)
            .attr('style', 'transition: fill 3s;')
            .attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
            .attr('width', thickness)
            .attr('height', thickness)
            .attr('r', thickness / 2);

        that.end = svg.append('circle')
            // .attr('class', 'progress-bar')
            .attr('fill', that.opt.progressBar)
            .attr('style', 'transition: fill 3s;')
            .attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
            .attr('width', thickness)
            .attr('height', thickness)
            .attr('r', thickness / 2);

        that.percentLabel = svg.append('text')
            // .attr('class', 'progress-label')
            .attr('style', 'display: none;')
            .attr('transform', `translate(${size.width / 2},${size.height / 2})`)
            .text('0');

        return {
            update(progressPercent, newOptions){
                that.opt = Object.assign({}, defaultOptions, that.opt, newOptions);

                that.progressBarBg.attr('fill', that.opt.progressBarBg);
                that.mainArcPath.attr('fill', that.opt.progressBar);
                that.start.attr('fill', that.opt.progressBar);
                that.end.attr('fill', that.opt.progressBar);

                if (progressPercent !== that.value) {

                    const startValue = that.value;
                    const startAngle = Math.PI * startValue / 50;
                    const angleDiff = Math.PI * progressPercent / 50 - startAngle;
                    const startAngleDeg = startAngle / Math.PI * 180;
                    const angleDiffDeg = angleDiff / Math.PI * 180;
                    const transitionDuration = that.opt.duration;

                    that.mainArcPath.transition().duration(transitionDuration).attrTween('d', () => function(t){
                        that.mainArc.endAngle(startAngle + angleDiff * t);
                        return that.mainArc();
                    });
                    that.end.transition().duration(transitionDuration).attrTween('transform', () => function(t){
                        return `translate(${size.width / 2},${size.height / 2})`
                            + `rotate(${(startAngleDeg + angleDiffDeg * t)})`
                            + `translate(0,-${outerRadius - thickness / 2})`;
                    });

                    const diffValue = (progressPercent - that.value) / 100;
                    const orgValue = that.value;
                    that.percentLabel.transition().duration(transitionDuration).tween('bla', () => function(t){
                        let tmpValue = 0;
                        if (t > 0.9) {
                            tmpValue = that.value;
                        } else {
                            tmpValue = (orgValue + diffValue * t * 100).toFixed(2);
                        }
                        if (typeof that.opt.callback === 'function') {
                            that.opt.callback(tmpValue);
                        }
                    });
                }
                that.value = progressPercent;
            },
        };
    };

    return RadialProgressBar;
}));
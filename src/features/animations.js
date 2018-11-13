
function setupAnimations() {

    /**
     * How to communicate through closure context
     */
    const closureContext = (function (initialMessage) {

        let message = initialMessage;

        let styleMessage = (msg) => msg.split(/\s/).join("-");

        console.log("closure context: " + message);

        return {
            getMessage,
            setMessage,
            setMessageStyle: (styleFn) => styleMessage = styleFn
        };

        function setMessage(msg) {
            message = msg;
            console.log(styleMessage("message set to " + msg));
        }

        function getMessage() {
            console.log(styleMessage("message is " + message));
            return message;
        }

    })("created.");

    closureContext.setMessage("1");
    closureContext.getMessage();
    closureContext.setMessage("2");
    closureContext.getMessage();

    // how to configure function through closure context
    closureContext.setMessageStyle((msg) => " -- " + msg);
    closureContext.getMessage();

    // animation parameter:

    const ops = new PentaPainterOps();
    const getRadius = (propertyPathArray) => ops.styler.getCascadingProperties(goldenContext.goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;

    goldenContext.animationCanvas = document.createElement('canvas');
    goldenContext.animationCanvas.width = goldenContext.canvasSize.width;
    goldenContext.animationCanvas.height = goldenContext.canvasSize.height;

    goldenContext.animateTreePath = ["outer", "inner", "middle", "spots.cores.outer", "spots.cores.middle", "spots.inner", "spots.outer", "spots.middle"];

    goldenContext.animationStartTime = 0;

    goldenContext.animationParams = params = {
        rotationPerSecond: Math.PI * PM.gold_,
        sinusPairRatio: 4 / 5,
        sinusProductRatio: PM.gold
    };

    goldenContext.animStyle = that = {

        timeValue: {
            rotationAngle: function () {
                return params.rotationPerSecond * (dt() / 1000);
            },
            sinus: function () {
                return Math.sin(this.rotationAngle());
            },
            sinusPair: function () {
                const rotationAngle = this.rotationAngle();
                return {
                    sin1: Math.sin(rotationAngle),
                    sin2: Math.sin(params.sinusPairRatio * rotationAngle)
                }
            },
            sinusProduct: function () {
                const { sin1, sin2 } = this.sinusPair();
                return sin1 * sin2 * params.sinusProductRatio;
            }
        },

        indexOf10: {
            invert: function (index) {
                return Math.max(0, 9 - Math.abs(index));
            },
            sinus: function () {
                return Math.floor(that.timeValue.sinus() * 5 + 5);
            },
            sinusProduct: function (minIndex, maxIndex, invert) {
                const prod = that.timeValue.sinusProduct();

                if (prod < this.minProd) {
                    this.minProd = prod;
                }
                if (prod > this.maxProd) {
                    this.maxProd = prod;
                }
                // console.log(" --- prod=", prod);
                // console.log(" --- prod minProd=", this.minProd, " - prod maxProd=", this.maxProd);

                const prodNormal = prod - this.minProd;
                const prodRange = this.maxProd - this.minProd;

                if (invert) {
                    _minIndex = 10 - maxIndex;
                    _maxIndex = 10 - minIndex;
                    maxIndex = _maxIndex;
                    minIndex = _minIndex;
                }
                const indexRange = maxIndex - minIndex;
                const result = Math.min(maxIndex, Math.floor(prodNormal / prodRange * indexRange + minIndex));

                return invert ? this.invert(result) : result;
            },
            minProd: 0,
            maxProd: 1
        },

        radius: {
            simpleSinus: function (propertyPathArray) {
                const radius = getRadius(propertyPathArray);
                const sin1 = that.timeValue.sinus();
                return radius + (radius * sin1);
            },
            sinusDelta: function (propertyPathArray) {
                const radius = getRadius(propertyPathArray);
                const { sin1, sin2 } = that.timeValue.sinusPair();
                if (propertyPathArray.indexOf("outer") > -1) {
                    sin1 += Math.PI / 3;
                    sin2 += Math.PI / 4;
                }
                return radius + (radius * sin1 * PM.gold) - (radius * sin2 * PM.gold_);
            },
            sinusProduct: function (propertyPathArray) {
                const radius = getRadius(propertyPathArray);
                const sinusProduct = that.timeValue.sinusProduct();
                return radius + (radius * sinusProduct);
            }
        },

        /**
         * This animation style rotates the spots of the goldenContext.animateTreePath
         * and resizes them to a radius calculated from the current rotation angle.
         */
        animateSpot: function (spot, propertyPathArray) {
            let rotationAngle = this.timeValue.rotationAngle();

            if (propertyPathArray.indexOf("outer") > -1) {
                spot.rotate(-rotationAngle);
            } else {
                spot.rotate(rotationAngle * PM.gold);
            }

            let radiusWave = this.radius.sinusProduct(propertyPathArray);
            // console.log("radiusWave=", radiusWave);
            spot.resize(radiusWave);
        },

        animatePentaStyles: function (styles, op, propertyPathArray) {
            if ((op === 'fillPentagram' || op === 'fillStar')
                && propertyPathArray.indexOf("supers") < 0
                && propertyPathArray.indexOf("core") < 0) {

                if (typeof styles !== 'object') {
                    styles = {};
                };

                if (propertyPathArray.indexOf("outer") > -1) {
                    let alphaIndex = that.indexOf10.sinusProduct(0, 9, false);
                    styles.fillStyle = goldenContext.pentaStyles.colors.alpha[alphaIndex].cyan;
                } else if (propertyPathArray.indexOf("inner") > -1) {
                    let alphaIndex = that.indexOf10.sinusProduct(0, 6, true);
                    //console.log("alphaIndex ", alphaIndex);
                    styles.fillStyle = goldenContext.pentaStyles.colors.alpha[alphaIndex].orange;
                } else if (propertyPathArray.indexOf("middle") > -1) {
                    let alphaIndex = that.indexOf10.sinusProduct(2, 8, true);
                    //console.log("alphaIndex ", alphaIndex);
                    styles.fillStyle = goldenContext.pentaStyles.colors.alpha[alphaIndex].magenta;
                }

            }
            return styles;
        }
    };

    goldenContext.animationParams.rotationPerSecond = Math.PI * PM.gold_;
    goldenContext.animationParams.sinusPairRatio = 4 / 5;
    goldenContext.animationParams.sinusProductRatio = PM.gold;

    // this function will be called from PentaPainter.paintPentaSpots()
    goldenContext.animateSpot = (spot, propertyPathArray) => goldenContext.animStyle.animateSpot(spot, propertyPathArray);
    // this function will be called from PentaPainter.paintPentaSpots()
    goldenContext.animatePentaStyles = (ctx, op, propertyPathArray) => goldenContext.animStyle.animatePentaStyles(ctx, op, propertyPathArray);

    document.addEventListener('keypress', (event) => {
        if (event.ctrlKey && event.charCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            if (!goldenContext.animationStartTime) {
                startAnimation();
            } else {

                // TODO: switch animation style

                stopAnimation();

            }
        }
    });

    function startAnimation() {
        goldenContext.animationStartTime = Date.now();
        goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
        window.requestAnimationFrame(animate);
    }

    function stopAnimation() {
        goldenContext.animationStartTime = 0;
        repaint();
    }

    function animate() {
        if (goldenContext.animationStartTime) {
            repaint(true);
            window.requestAnimationFrame(animate);
        }
    }

    function dt() {
        return Date.now() - goldenContext.animationStartTime
    }
}

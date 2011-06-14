var CIAPI = CIAPI || {};

/**
    @namespace Test data
*/
CIAPI.__testData = (function() {
   try {
       var
        _i, _j,
        _marketList = [],
        _priceBars = {},
       _currentBar, _currentMarket,

       /**
        * @private
        */
        _generateNextPrice = function (lastPrice) {
            var direction = Math.random() > 0.5 ? 1 : -1;
            return lastPrice.Close + (direction * lastPrice.Close * 0.05);
        },
       /**
        * @private
        */
        _createPriceBar = function(previousBar, interval) {
            var intervalInMs = {
                minute: 1000 * 60,
                hour:  1000 * 60 * 60,
                day: 1000 * 60 * 60 * 24
            };
            var theDate = new Date(previousBar.BarDate.getTime() - intervalInMs[interval]);
            var close = _generateNextPrice(previousBar);
            return {
                "BarDate":theDate,
                "Close": close,
                "High": close * (Math.random() + 1),
                "Low":close * (1- Math.random()),
                "Open":previousBar.Close
            };
        },
        _updateCandle = function(marketId) {
                var idx, change,
                    direction,
                    _priceBars;

                for(idx in CIAPI.__testData.MarketList)
                {
                    if (CIAPI.__testData.MarketList[idx].MarketId == marketId){
                        _priceBars = CIAPI.__testData.MarketList[idx].PriceHistory;
                        break;
                    }
                }
                direction = Math.random() > 0.5 ? 1 : -1;
                change = direction * _priceBars.minute[0].Close * 0.05;
                _priceBars.minute[0].Close += change;
                _priceBars.minute[0].High = (_priceBars.minute[0].Close > _priceBars.minute[0].High) ? _priceBars.minute[0].Close : _priceBars.minute[0].High;
                _priceBars.minute[0].Low = (_priceBars.minute[0].Close < _priceBars.minute[0].Low) ? _priceBars.minute[0].Close : _priceBars.minute[0].Low;
                onMessage({
                    MarketId: marketId,
                    bid : _priceBars.minute[0].Close,
                    offer : _priceBars.minute[0].Close,
                    high : _priceBars.minute[0].High,
                    low : _priceBars.minute[0].Low,
                    change : change
                });
            };
        }


        for (_i = 0; _i <= 101; _i++) {
            _currentBar = {
                "BarDate":new Date(),
                "Close":1.6283,
                "High":1.6285,
                "Low":1.6283,
                "Open":1.6284
            };
            _currentMarket = {
                "MarketId": _i,
                "Name": "{marketName} CFD #" + (_i + 1),
                "PriceHistory": {
                    minute: []
                }
            };
            for (_j = 1000; _j <= 1010; _j++) {
                _currentMarket.PriceHistory.minute.push(_currentBar);

                _currentBar = _createPriceBar(_currentBar, 'minute');
            }

            _marketList.push(_currentMarket);
        }
        return {
            MarketList: _marketList
        };
    }
    catch(error) {
       console.log(error);
    }
})();

/**
    @namespace A collection of services that you can call
*/
CIAPI.services = (function() {

    return {
        GetPriceBars: function(marketId, priceBars, success, error) {
            var idx, interval='minute', marketPriceBars=[];

            if (marketId < 1 || marketId > 100) {
                error({ message: "Only marketId's between 1 and 100 are available" });
                return;
            }
            if (priceBars > 1000) {
                error({ message: "Can only return a maximum of 1000 pricebars" });
                return;
            }

            for(idx in CIAPI.__testData.MarketList)
            {
                if (CIAPI.__testData.MarketList[idx].MarketId == marketId){
                    marketPriceBars = CIAPI.__testData.MarketList[idx].PriceHistory;
                    break;
                }
            }

            setTimeout(function() {
                success({
                    PartialPriceBar: marketPriceBars.minute[0],
                    PriceBars: marketPriceBars.minute.slice(1, priceBars + 1)
                });
            }, 360);
        }
    };

})();

CIAPI.streams = (function() {
    var subscriptions = {};

    return {
        SubscribeToPrice: function(marketId, onMessage) {

        }
    };

})();
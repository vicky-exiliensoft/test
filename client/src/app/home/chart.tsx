import React, { useEffect, useRef, memo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

function TradingViewWidget1Hours() {
  const container1Minute = useRef();
  const container1Hour = useRef();
  const container4Hours = useRef();
  const container1Day = useRef();
  const [messages, setMessages] = useState([]);
  const [buySignal, setBuySignal] = useState(null);

  useEffect(() => {
    const addTradingViewScript = (containerRef, symbol, indicator) => {
      if (!containerRef.current.querySelector("script")) {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
          {
            "width": "1000",
            "height": "800",
            "symbol": "BINANCE:BTCUSDT",
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "withdateranges": true,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "calendar": false,
            "studies": [
              "STD;MACD"
            ],
            "support_host": "https://www.tradingview.com"
          }`;
        containerRef.current.appendChild(script);
      }
    };

    // Simulate MACD line movement and set buy/sell signal
    const simulateMACD = () => {
      // Simulating MACD line movement
      setInterval(() => {
        // Simulating MACD line going up or down randomly
        const isUp = Math.random() < 0.5;
        setBuySignal(isUp);
        // Automatically hide the signal after 20 seconds
        setTimeout(() => {
          setBuySignal(null);
        }, 20000);
      }, 30000); // Adjust interval time according to your need
    };

    // Add trading view script for each timeframe
    addTradingViewScript(container1Minute, "MEXC:BTCUSDT|1M", {});
    addTradingViewScript(container1Hour, "MEXC:BTCUSDT|1H", {});
    addTradingViewScript(container4Hours, "MEXC:BTCUSDT|4H", {});
    addTradingViewScript(container1Day, "MEXC:BTCUSDT|1D", {});

    simulateMACD(); // Simulate MACD line movement
  }, []);

  return (
    <Container className="divide-y-2">
      <Row>
        <Col>
          <h1 className="text-center my-4 bold d-flex gap-2 align-items-center justify-content-center text-capitalize">
            <small className="text-secondary">BTC</small>
            to
            <small className="text-primary">USDT</small>
            live data
          </h1>
        </Col>
      </Row>
      {/* Display buy or sell signal */}
      {buySignal !== null && (
        <Row>
          <Col className="mb-4">
            <div className={`rounded-circle ${buySignal ? "bg-success" : "bg-danger"}`} style={{ width: "77px", height: "80px" }}></div>
            <strong><span className={buySignal ? "text-success" : "text-danger"}>{buySignal ? "positive" : "negative"}</span></strong>
          </Col>
        </Row>
      )}
      {/* Rest of your code */}
      <Row>
        <Col>
          <h5 className="text-start fw-bold d-flex align-items-center gap-1">
            <span>MACD</span>
            <small className="text-primary">(1 Minute )</small>
          </h5>
          <div className="tradingview-widget-container w-100" ref={container1Minute} id="technical-analysis-chart-demo-1m">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-messages">
              {messages.map((message, index) => (
                <div key={index} className="tradingview-widget-message">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5 className="text-start fw-bold d-flex align-items-center gap-1">
            <span>MACD</span>
            <small className="text-primary">(1 Hour )</small>
          </h5>
          <div className="tradingview-widget-container w-100" ref={container1Hour} id="technical-analysis-chart-demo-1h">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-messages">
              {messages.map((message, index) => (
                <div key={index} className="tradingview-widget-message">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5 className="text-start fw-bold d-flex align-items-center gap-1">
            <span>MACD</span>
            <small className="text-primary">(4 Hours )</small>
          </h5>
          <div className="tradingview-widget-container w-100" ref={container4Hours} id="technical-analysis-chart-demo-4h">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-messages">
              {messages.map((message, index) => (
                <div key={index} className="tradingview-widget-message">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5 className="text-start fw-bold d-flex align-items-center gap-1">
            <span>MACD</span>
            <small className="text-primary">(1 Day )</small>
          </h5>
          <div className="tradingview-widget-container w-100" ref={container1Day} id="technical-analysis-chart-demo-1d">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-messages">
              {messages.map((message, index) => (
                <div key={index} className="tradingview-widget-message">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default memo(TradingViewWidget1Hours);
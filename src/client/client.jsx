import "./client.css";
import '@stripe/terminal-js';

import { loadStripeTerminal } from "@stripe/terminal-js";

export const Client = (props) => {
  return (
      <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-sm-6 offset h-100">
          <div className="row title">Simulate reader pairing</div>
          <div className="row margin pad">
            <button id="discover-button" onClick={discoverReaderHandler}>
              1. Discover readers
              <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.293 2.709A1 1 0 0 1 6.71 1.293l6.3 6.3a1 1 0 0 1 0 1.414l-6.3 6.3a1 1 0 0 1-1.416-1.416L10.884 8.3z"
                    fill-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className="row margin pad">
            <button id="connect-button" onClick={() => connectReaderHandler(discoveredReaders)}>
              2. Connect to a reader
              <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.293 2.709A1 1 0 0 1 6.71 1.293l6.3 6.3a1 1 0 0 1 0 1.414l-6.3 6.3a1 1 0 0 1-1.416-1.416L10.884 8.3z"
                    fill-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <hr/>
          <div className="row title">Simulate a transaction</div>
          <div className="row margin pad text">Enter an amount</div>
          <div className="row pad">
            <div className="">
              <input id="amount-input" type="text" value="2000" />
            </div>
          </div>
          <div className="row margin pad">
            <button id="collect-button">
              3. Collect Payment
              <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.293 2.709A1 1 0 0 1 6.71 1.293l6.3 6.3a1 1 0 0 1 0 1.414l-6.3 6.3a1 1 0 0 1-1.416-1.416L10.884 8.3z"
                    fill-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div className="row margin pad">
            <button id="capture-button">
              4. Capture Payment
              <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.293 2.709A1 1 0 0 1 6.71 1.293l6.3 6.3a1 1 0 0 1 0 1.414l-6.3 6.3a1 1 0 0 1-1.416-1.416L10.884 8.3z"
                    fill-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="col-sm-6 h-100 log-col">
          <div className="row title">Logs</div>
          <div className="row">
            <div className="col-sm-12" id="logs"></div>
          </div>
        </div>
      </div>
    </div>)
};

const StripeTerminal = loadStripeTerminal();

var discoveredReaders;
var paymentIntentId;

var terminal = StripeTerminal.then((t) => t.create({
  onFetchConnectionToken: fetchConnectionToken,
  onUnexpectedReaderDisconnect: unexpectedDisconnect,
}));

function unexpectedDisconnect() {
  // In this function, your app should notify the user that the reader disconnected.
  // You can also include a way to attempt to reconnect to a reader.
  console.log("Disconnected from reader")
}

function fetchConnectionToken() {
  // Do not cache or hardcode the ConnectionToken. The SDK manages the ConnectionToken's lifecycle.
  return fetch('http://localhost:4242/connection_token', { method: "POST" })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        return data.secret;
      });
}

// Handler for a "Discover readers" button
function discoverReaderHandler() {
  var config = {simulated: true};
  terminal.then(t => t.discoverReaders(config).then(function(discoverResult) {
    if (discoverResult.error) {
      console.log('Failed to discover: ', discoverResult.error);
    } else if (discoverResult.discoveredReaders.length === 0) {
      console.log('No available readers.');
    } else {
      discoveredReaders = discoverResult.discoveredReaders;
      console.log('terminal.discoverReaders', discoveredReaders);
    }
  }));
}

// Handler for a "Connect Reader" button
function connectReaderHandler(discoveredReaders) {
  // Just select the first reader here.
  var selectedReader = discoveredReaders[0];
  console.log(selectedReader)
  terminal.then(t => t.connectReader(selectedReader).then(function(connectResult) {
    if (connectResult.error) {
      console.log('Failed to connect: ', connectResult.error);
    } else {
      console.log('Connected to reader: ', connectResult.reader.label);
      console.log('terminal.connectReader', connectResult)
    }
  }));
}

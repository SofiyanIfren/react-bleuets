import "./client.css";
import '@stripe/terminal-js';

import { loadStripeTerminal } from "@stripe/terminal-js";
import { useState } from "react";

export const Client = (props) => {

  const [amount, setAmount] = useState("");

  return (
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-sm-6 offset h-100">
            <div className="row title">Utilisation du Simulateur</div>
            <div className="row margin pad">
              <button onClick={() => discoverReaderHandler()}>
                1. Découvrir les lecteurs
              </button>
            </div>
            <div className="row margin pad">
              <button onClick={() => connectReaderHandler(discoveredReaders)}>
                2. Connecter un lecteur
              </button>
            </div>

            <hr/>

            <div className="row title">Simuler une transaction</div>
            <div className="row margin pad text">Entrez un montant</div>
            <div className="row pad">
              <input id="amount-input" type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
            <div className="row margin pad">
              <button id="collect-button" onClick={() => collectPayment(amount)}>
                3. Collecter le paiement
              </button>
            </div>

            <div className="row margin pad">
              <button id="capture-button" onClick={() => capture(paymentIntentId)}>
                4. Capture Payment
                <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M5.293 2.709A1 1 0 0 1 6.71 1.293l6.3 6.3a1 1 0 0 1 0 1.414l-6.3 6.3a1 1 0 0 1-1.416-1.416L10.884 8.3z"
                      fill-rule="evenodd"></path>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>)
};

const StripeTerminal = loadStripeTerminal();

let discoveredReaders;
let paymentIntentId;

let terminal = StripeTerminal.then((t) => t.create({
  onFetchConnectionToken: fetchConnectionToken,
  onUnexpectedReaderDisconnect: unexpectedDisconnect,
}));

function unexpectedDisconnect() { // In this function, your app should notify the user that the reader disconnected
  // You can also include a way to attempt to reconnect to a reader.
  console.log("Disconnected from reader")
}

function fetchConnectionToken() {
  // Do not cache or hardcode the ConnectionToken. The SDK manages the ConnectionToken's lifecycle.
  return fetch('http://localhost:4242/connection_token', { method: "POST" })
      .then(function(response) { return response.json(); })
      .then(function(data) { return data.secret; });
}

function discoverReaderHandler() { // Handler for a "Discover readers" button
  let config = { simulated: true };
  terminal.then(t => t.discoverReaders(config).then(function(discoverResult) {
    if (discoverResult.error) { console.log('Failed to discover: ', discoverResult.error); }
    else if (discoverResult.discoveredReaders.length === 0) { console.log('No available readers.'); }
    else {
      discoveredReaders = discoverResult.discoveredReaders;
      console.log('terminal.discoverReaders', discoveredReaders);
    }
  }));
}

function connectReaderHandler(discoveredReaders) { // Handler for a "Connect Reader" button
  let selectedReader = discoveredReaders[0]; // Just select the first reader here
  console.log(selectedReader)
  terminal.then(t => t.connectReader(selectedReader).then(function(connectResult) {
    if (connectResult.error) { console.log('Failed to connect: ', connectResult.error); }
    else {
      console.log('Connected to reader: ', connectResult.reader.label);
      console.log('terminal.connectReader', connectResult)
    }
  }));
}

function fetchPaymentIntentClientSecret(amount) {
  const bodyContent = JSON.stringify({ amount: amount });
  return fetch('http://localhost:4242/create_payment_intent', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: bodyContent
  })
      .then(function (response) { return response.json(); })
      .then(function (data) { return data.client_secret; });
}

function collectPayment(amount) { // collecter les infos de la carte et traiter le paiement
  fetchPaymentIntentClientSecret(amount).then(function (client_secret) {
    console.log(client_secret)
    terminal.then(t => {
      t.collectPaymentMethod(client_secret).then(function (result) {
        if (result.error) {
          // Placeholder for handling result.error
          console.log(result.error)
        } else {
          console.log('terminal.collectPaymentMethod', result.paymentIntent);
          t.processPayment(result.paymentIntent).then(function (result) {
            if (result.error) {
              console.log(result.error)
            } else if (result.paymentIntent) {
              paymentIntentId = result.paymentIntent.id;
              console.log('terminal.processPayment', result.paymentIntent);
            }
          });
        }
      });
    })
  });
}

function capture(paymentIntentId) { // capture de paiement client
  return fetch('http://localhost:4242/capture_payment_intent', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "payment_intent_id": paymentIntentId })
  })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (data) {
        console.log('server.capture', data);
      });
}

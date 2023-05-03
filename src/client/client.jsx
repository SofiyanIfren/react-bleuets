import "./client.css";

import * as terminalService from './terminal-service'
import * as apiService from './api-service'

import { useState } from "react";

export const Client = (props) => {

  const [amount, setAmount] = useState("");

  return (
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-sm-6 offset h-100">
            <div className="row title">Utilisation du Simulateur</div>
            <div className="row margin pad">
              <button onClick={() => terminalService.discoverReaderHandler()}>
                1. Découvrir les lecteurs
              </button>
            </div>
            <div className="row margin pad">
              <button onClick={() => terminalService.connectReaderHandler(terminalService.discoveredReaders)}>
                2. Connecter un lecteur
              </button>
            </div>

            <hr/>

            <h2 class="mt-5 mb-4">Choisissez le montant</h2>
            <div class="col-md-5 mb-2 ">
              <button value={amount} onClick={(e) => setAmount('5000')}>Donner 5€</button>
            </div>
            <div class="col-md-5 mb-2">
              <button value={amount} onClick={(e) => setAmount('10000')}>Donner 10€</button>
            </div>
            <div class="col-md-5">
              <button value={amount} onClick={(e) => setAmount('15000')}>Donner 15€</button>
            </div>
            <h2 className="mb-3 mt-5 ">Vous souhaitez donner plus</h2>
            {/*<div className="row title">Simuler une transaction</div>*/}
            <div className="row margin pad text">Entrez un montant</div>
            <div className="row pad">
              <input id="amount-input" type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
            <div className="row margin pad">
              <button id="collect-button" onClick={() => terminalService.collectPayment(amount)}>
                3. Collecter le paiement
              </button>
            </div>

            <div className="row margin pad">
              <button id="capture-button" onClick={() => terminalService.capture(terminalService.paymentIntentId)}>
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


import "./client.css";

import * as terminalService from './terminal-service'
import * as apiService from './api-service'

import { useState } from "react";

export const Client = (props) => {

  const [amount, setAmount] = useState("");

  return (
      <div>
        <div>
          <div>
            <div>Utilisation du Simulateur</div>
            <div>
              <button onClick={() => terminalService.discoverReaderHandler()}>
                1. Découvrir les lecteurs
              </button>
            </div>
            <div>
              <button onClick={() => terminalService.connectReaderHandler(terminalService.discoveredReaders)}>
                2. Connecter un lecteur
              </button>
            </div>
            <div>
              <button onClick={() => terminalService.disconnectReaderHandler()}>
                3. Déconnecter tous les lecteurs
              </button>
            </div>

            <hr/>

            <h2>Choisissez le montant</h2>
            <div>
              <button value={amount} onClick={(e) => setAmount('5000')}>Donner 5€</button>
            </div>
            <div>
              <button value={amount} onClick={(e) => setAmount('10000')}>Donner 10€</button>
            </div>
            <div>
              <button value={amount} onClick={(e) => setAmount('15000')}>Donner 15€</button>
            </div>

            <h2>Vous souhaitez donner plus</h2>
            {/*<div className="row title">Simuler une transaction</div>*/}
            <div>Entrez un montant</div>
            <div>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>

            <div>
              <button onClick={() => terminalService.collectPayment(amount)}>
                3. Collecter le paiement
              </button>
            </div>

            <div>
              <button onClick={() => terminalService.capture(terminalService.paymentIntentId)}>
                4. Capture Payment
              </button>
            </div>

          </div>
        </div>
      </div>)
};


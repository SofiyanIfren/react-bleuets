const express = require("express");
const app = express();
const cors = require('cors');
const { resolve } = require("path");

app.use

// This is your test secret API key.
const stripe = require("stripe")("sk_test_51MwSyoHH1ouxo7ZFLcb8xasuXHKNC84HXpRHycqRqvTBQJCVDXQuUxfzcBerUMj5At0naMu09Qy5FWHWJxA97ec100bVxC6pus"); // <SK_API_KEY>

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000'
}))

const createLocation = async () => {
    const location = await stripe.terminal.locations.create({
        display_name: 'HQ',
        address: {
            line1: '10 Boulevard Haussmann',
            city: 'Paris',
            country: 'FR',
            postal_code: '75009',
        }
    });

    return location;
};



// The ConnectionToken's secret lets you connect to any Stripe Terminal reader
// and take payments with your Stripe account.
// Be sure to authenticate the endpoint for creating connection tokens.
app.post("/connection_token", async(req, res) => {
    let connectionToken = await stripe.terminal.connectionTokens.create();
    console.log(connectionToken)
    res.json({secret: connectionToken.secret});
})

app.post("/create_payment_intent", async(req, res) => {
    // For Terminal payments, the 'payment_method_types' parameter must include
    // 'card_present'.
    // To automatically capture funds when a charge is authorized,
    // set `capture_method` to `automatic`.
    console.log('amount :' + req.body.amount)
    const intent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'eur',
        payment_method_types: [
            'card_present',
        ],
        capture_method: 'manual',
    });
    res.json(intent);
});



app.post("/capture_payment_intent", async(req, res) => {
    const intent = await stripe.paymentIntents.capture(req.body.payment_intent_id);
    res.send(intent);
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));

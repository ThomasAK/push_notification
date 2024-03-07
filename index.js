import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import webpush from "web-push";
const app = express()
const port = 3000

app.use(cors());
app.use(express.static("public"))
app.use(bodyParser.json()) // for parsing application/json

const apiKeys = { pubKey: "BBXYA0Gp9ETY9qkP_CXHJNcmeGZ340rMuVb6UskGaw4oOG0fdiqV9YtR4rbQKgpVno_5CNs8rYgyeLRfnXK3gCU", privKey: process.env['PRIVATE_KEY'] }

webpush.setVapidDetails('mailto:thomas.a.k@hotmail.com', apiKeys.pubKey, apiKeys.privKey)

const subscriptions = new Set();

setInterval(() => {
    console.log('pushing notifications.')
    for (const subscriber of subscriptions){
        webpush.sendNotification(subscriber, "Hello world");
    }
}, 30000)

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    if (!subscription)
        return res.status(400).json({error: 'No subscription.', success: false})
    if (!isValidUrl(subscription.endpoint))
        return res.status(400).json({error: 'Url not valid.', success: false})
    subscriptions.add(subscription);
    res.json({success: true})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
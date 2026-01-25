import axios from "axios";

async function generateAccessToken() {
    console.log("fdsfdsd")
    try {
        const { data } = await axios({
            url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            method: "POST",
            data: "grant_type=client_credentials",
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET,
            },
        });
        return data.access_token;
    } catch (error) {
        console.log(error);
    }
}

async function createOrder() {
    try {
        const access_token = await generateAccessToken();
        console.log("dadassda",access_token)

        const { data } = await axios({
            url: "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
            data: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "49.00",
                        },
                    },
                ],
            }),
        });
        // save data for user still dont payed;
        console.log('data:', data);
        return data.id;
    } catch (error) {
        console.log(error);
    }
};

async function capturePayment(orderId) {
    try {
        const access_token = await generateAccessToken();

        const { data } = await axios({
            url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });
        // save data in db
        console.log('data:', data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export { generateAccessToken, createOrder, capturePayment };
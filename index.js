const puppeteer = require("puppeteer");

/**
 * login to linkedin.
 * get all contacts, save to disk. 
 * use cli to select which people to delete
 * load each contct page, delete contact.
 */


async function login() {
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/');
    const usernameInput = await page.$('#login-email');
    const passwordInput = await page.$('#login-password');
    const submitInput = await page.$('#login-submit');
    const username = process.env.LINKEDIN_KILLER_EMAIL;
    const password = process.env.LINKEDIN_KILLER_PASSWORD;
    await usernameInput.type(username);
    await passwordInput.type(password);
    await submitInput.click();
    await page.waitForNavigation();
    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');
    /**
     * scroll to bottom
     * wait 3 seconds while fetch for more happens
     * repeat until you cant scroll anymore.
     */
    const contactContainer = await page.$('.mn-connections.connections-container.Elevation-2dp');
    let preFetchContainerHeight;
    let postFetchContainerHeight;

    do {
        await scrollAndWait(contactContainer);
        console.log({ preFetchContainerHeight, postFetchContainerHeight } );
    } while (preFetchContainerHeight < postFetchContainerHeight);


    await browser.close();

    async function scrollAndWait(cc) {
        preFetchContainerHeight = (await cc.boundingBox()).height;

        await page.evaluate(() => {
            const h = document.body.getBoundingClientRect().height;
            window.scrollTo(0, h)
        });

        await page.waitFor(3000);
        postFetchContainerHeight = (await cc.boundingBox()).height;
    }
}

login();
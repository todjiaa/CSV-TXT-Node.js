import {
    sessionWrapper,
    sessionWrapperH2,
    sessionWrapperExtendButton,
    logOutForm
} from "./variablesAndFlags.js";

const intervalTime = 10;
let remainingTime = intervalTime;

const fetchSessionExpireTime = () => {
    const fetchStartTime = Date.now();

    const sessionExpirationTime = fetch("/sessionExpireTime", {method: "POST"})
    .then(res => res.json())
    .then(sessionExpires => {
        const fetchEndTime = Date.now();
        return {
            sessionExpirationDateInMs: sessionExpires,
            fetchResponseTime: fetchEndTime - fetchStartTime
        }
    })
    .catch(err => console.log("Didn't manage to fetch the session life time!"))

    return sessionExpirationTime;
}

const countElapsedTenSeconds = (interval) => {
    sessionWrapperH2.innerHTML = `Your session will expire in ${--remainingTime} seconds. Please press "Extend Session" button to continue.`

    if (remainingTime === 0) {
        logOutForm.submit();
        
        clearInterval(interval);
    }
}







// const per = new PerformanceNavigationTiming()



const extendSession = (interval) => {
    sessionWrapper.classList.remove("show-flex");
    
    clearInterval(interval);

    remainingTime = intervalTime;

    fetch("/dashboard", {method: "GET"})
    .then(res => sessionLifeTimeCounter());

    // sessionLifeTimeCounter()

}

export const sessionLifeTimeCounter = async () => {
    let interval;

    // const [fetchResult] = fetchSessionExpireTime();

    const sessionExpirationTime = await fetchSessionExpireTime();
    const {
        sessionExpirationDateInMs,
        fetchResponseTime
    } = sessionExpirationTime

    const {
        sessionStartTime,
        cookieRemainingTimeInMs,
        // cookieOriginalMaxAge
    } = sessionExpirationDateInMs


    
    // console.log("Fetch response time", fetchResponseTime)

    

    // const sessionExpirationLocalTime = new Date(cookieRemainingTimeInMs).toString();

    // const sessionExpirationLocalTimeInMs = Date.parse(sessionExpirationLocalTime);

    const localTimeNow = Date.now();


    const performanceTime = localTimeNow - sessionStartTime;

    console.log("performance time", performanceTime)

    console.log("session ramining time", cookieRemainingTimeInMs)

    console.log("Total", cookieRemainingTimeInMs + performanceTime)


    const timeOut = cookieRemainingTimeInMs - (intervalTime * 1000);

    console.log("Time Out", timeOut)


    setTimeout(() => {
        sessionWrapper.classList.add("show-flex");

        sessionWrapperH2.innerHTML = `Your session will expire in ${remainingTime} seconds. Please press "Extend Session" button to continue.`

        sessionWrapperExtendButton.classList.add("show-block", "button");
        
        interval = setInterval(() => {
            countElapsedTenSeconds(interval);
        }, 1000)

    }, timeOut)



    // console.log(sessionExpirationLocalTimeInMs)

    // await fetchResult ? timeOutTime : 60000
    sessionWrapperExtendButton.addEventListener("click", function eventHandler () {
        extendSession(interval);

        sessionWrapperExtendButton.removeEventListener("click", eventHandler);
    });
}
function loading() {
    return new Promise(res => {
        setTimeout(() => res("data"), 2000);
    }
    )
}


async function test() {
    console.log("start");

    const load = await loading();
    console.log(load);

    console.log("end");
}
test();
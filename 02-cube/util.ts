class Util {

    static file(url: string) {

        return new Promise<string>((rs, rj) => {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onreadystatechange = () => {
                if(xhr.readyState == XMLHttpRequest.DONE) {
                    rs(xhr.responseText);
                }
            }
            xhr.send();
        });
    }
}

export default Util;
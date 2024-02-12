export default function compileHTML(htmlString: string, params:  {[key: string]: any}) {
    for (var key in params) {
        htmlString = htmlString.replace(new RegExp('{{' + key + '}}', 'g'), params[key]);
    }
    return htmlString;
}
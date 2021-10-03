//add parenting

var fs = require('fs');
var http = require('http');
const open = require('open');
var url = require('url')

var allData = {
    actionCounter: 0,
    html: "",
    js: (`
    var UI = {
    funcBindObj: class {
        constructor(data) {
            this.run = data
            this.varval = undefined
        }
        get value() {
            return this.varval
        }
        set value(val) {
            this.varval = val
            this.run()
        }
    },
    bindObj: class {
        constructor(id,selector = "innerHTML"){
            this.id = id
            this.selector = selector
            this.varval = undefined
        }
        get value() {
            return this.varval
        }
        set value(val) {
            eval(\`document.getElementById("\${this.id}").\${this.selector} = \${this.varval}\`)
        }
        
    },
    setByID: function({
        selector = "innerHTML",
        id,
        value
    }) {
        //console.log(\`document.getElementById("\${id}").\${selector} = value\`)
        eval(\`document.getElementById("\${id}").\${selector} = "\${value}"\`)
    },
    getByID: function({
        selector = "innerHTML",
        id
    }) {
        return eval(\`document.getElementById("\${id}").\${selector}\`)
    }
    }
    `)
}
module.exports = {
    canvas: function (data) {
        data()
    },
    compile: function () {
        fs.writeFileSync(`easyUIpage.html`, `
            <!DOCTYPE html>
            <head>
                <title>easyUI</title>
            </head>
            <body>
            ${allData.html}
            </body>
            <script>
            ${allData.js}
            </script>
            `, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        console.log("succesfully compiled! launching server...")
        console.log("server launching is turned off. run the html file")
        // const PORT = 8080;

        // fs.readFile('./easyUIpage.html', function (err, html) {

        //     if (err) throw err;

        //     http.createServer(function (request, response) {
        //         //response.setHeader('./easyUIpage.html')
        //         response.writeHeader(200, { "Content-Type": "text/html" });
        //         response.write(html);
        //         response.end();
        //     }).listen(PORT);
        // });

        // console.log("launched!")

        // try{
        //     open('http://localhost:8080/', {newInstance: true});
        // } catch (error) {
        //     console.log("Oops! we couldnt open your browser. Please visit \"http://localhost:8080/\" to use your program ")
        // }
    },
    code: function (data) {
        console.log(data.toString())
        var temp = data.toString()
        allData.js += `\n ${temp.substring(temp.indexOf("{") + 1).slice(0, -1)}`
    },
    newUIElement: {
        text: function ({
            id = "",
            data = "",
            isView = false,
            position = {}
        }) {
            var ret = fullWrapper(
                position,
                `\n <p ${id != "" ? `id='${id}'` : ""}> ${data} </p>`
            )
            if (isView) return ret
            allData.html += ret
        },
        button: function ({
            element,
            position = {},
            action = (() => console.log("e"))
        }) {
            var ret = fullWrapper(
                position,
                `\n<button onclick = "action${allData.actionCounter}()">${element}</button>`
                )
            allData.js += `\n action${allData.actionCounter} = (${action})`
            allData.html += ret
        },
        textInput: function ({
            placeholder = "",
            id = "",
            onChange = "",
            position = {}
        }) {
            allData.html += fullWrapper(
                position, 
                `\n<br> <input ${id != "" ? `id='${id}'` : ""} ${placeholder != "" ? `placeholder='${placeholder}'` : ""} ${onChange != "" ? `onkeyup='(${onChange})()'` : ""}>`
                )
            
        }, 
        image: function ({
            source,
            position = {},
            size = {},
            dummy = false
        }) {
            var ret = fullWrapper(
                position,
                `\n <img src="${source}" width="${JSON.stringify(size) != {}? size.x : "100%"}" height="${JSON.stringify(size) != {}? size.x : "100%"}"`
            )
            if (dummy) return ret 
            allData.html += ret
        }
    }
}

function createDiv(x,y) {
    return(` \n <div style="position: absolute; top: ${y}; left:${x};">`)
}

function fullWrapper(position,string) {
    if (JSON.stringify(position) == "{}") {
        var ret = "<div>"
    } else {
        
        var ret = createDiv(position.x,position.y)
    }
    ret += string + "</div>"
    return ret
}
import { Elysia } from "elysia";
import { html } from "@elysiajs/html"

const file = Bun.file("src/log.txt")
let fileAsString = await file.text()
let lines = fileAsString.split("\n")

let baseHtml = `
<html lang="en">
  <head>
      <title>Log Parser</title>
  </head>
  <body>
    <table>
      <tr>
        <th>TIME</th>
        <th>LEVEL</th>
        <th>SCREEN</th>
        <th>SUBJECT</th>
        <th>MESSAGE</th>
      </tr>`

for(let line in lines) {
  let tempLine = lines[line]
  // seperating each line into time, level, screen and message
  let tempLine_split = tempLine.split(/^\[(?<time>\d\d[:\.]\d\d[:\.]\d\d) (?<level>[a-z]+)(?: +screen_(?<screen>\d+))? +(?<modName>[^\]]+)\]/i)
  
  let time = tempLine_split[1]
  let level = tempLine_split[2]
  let screen = tempLine_split[3]
  let subject = tempLine_split[4]
  let message = tempLine_split[5]

  
  let tempLine_list = {time: time, level: level, screen: screen, subject: subject, message: message}
  
  console.log(tempLine_split)

  // lines[line] = tempLine

  baseHtml += `
      <tr>
        <td>` + tempLine_list.time + `</td>` +
        `<td>` + tempLine_list.level + `</td>` +
        `<td>` + tempLine_list.screen + `</td>` +
        `<td>` + tempLine_list.subject + `</td>` +
        `<td>` + tempLine_list.message + `</td>
      </tr>`
}

baseHtml += `
    </table>
  </body>
</html>`

const app = new Elysia().use(html()).get("/", ({ html }) => html(baseHtml)

).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
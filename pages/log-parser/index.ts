import { Elysia } from "elysia";
import { html } from "@elysiajs/html"

export default async function logParser() {
  const file = Bun.file("src/log (3c6dfdde99be46f291e9d1a6502dfb25).txt")
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
          <th>SUBJECT</th>
          <th>MESSAGE</th>
        </tr>`
  
  let tempLine_list = []
  let tempLine_listLength = 0
  
  for(let line in lines) {
    let tempLine = lines[Number(line)]
    let prevLine = lines[Number(line) - 1]
    let nextLine = lines[Number(line) + 1]
    let wholeLine : String = ""
  
    //* skip line if it is empty
    if (tempLine.length == 0) {
      continue
    }
  
    //* add lines without intro to previous message
    wholeLine = tempLine
  
    let nextCount = 1
    while (nextLine.startsWith(" ")) {
      nextLine = lines[Number(line) + nextCount]
      nextCount++
      tempLine = tempLine + "<br />" + nextLine
      wholeLine = tempLine
    }

    //* seperating each line into time, level, screen and message
    let tempLine_split = wholeLine.split(/^\[(?<time>\d\d[:\.]\d\d[:\.]\d\d) (?<level>[a-z]+)(?: +screen_(?<screen>\d+))? +(?<modName>[^\]]+)\]/i)
  
    if (tempLine_split[1] == undefined) {
      continue
    }
  
    let time = tempLine_split[1]
    let level = tempLine_split[2]
    let screen = tempLine_split[3]
    let subject = tempLine_split[4]
    let message = tempLine_split[5]
  
    let tempLine_object = {time: time, level: level, subject: subject, message: message}
    
    // console.log(tempLine_split)
  
    tempLine_listLength = tempLine_list.push(tempLine_object)
  }
  
  //* write lines to html
  for (let tl in tempLine_list) {
    let tempLine_object = tempLine_list[tl]
    baseHtml += `
        <tr>
          <td>` + tempLine_object.time + `</td>` +
          `<td>` + tempLine_object.level + `</td>` +
          `<td>` + tempLine_object.subject + `</td>` +
          `<td>` + tempLine_object.message + `</td>
        </tr>`
  }
  
  baseHtml += `
      </table>
    </body>
  </html>`
  
  return baseHtml
}
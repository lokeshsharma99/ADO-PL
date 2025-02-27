(()=>{var e={};e.id=444,e.ids=[444],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},2303:(e,t,o)=>{"use strict";o.r(t),o.d(t,{patchFetch:()=>u,routeModule:()=>p,serverHooks:()=>h,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>d});var r={};o.r(r),o.d(r,{POST:()=>l});var a=o(2706),n=o(8203),i=o(5994),s=o(9187);async function l(e){try{let{format:t,content:o}=await e.json(),r="",a="",n="";switch(t){case"html":r=c(o),a="text/html",n="html";break;case"markdown":r=function(e){var t,o,r;let a=e.type.charAt(0).toUpperCase()+e.type.slice(1),n=[`> **${a}**`,e.author?`> **Author:** ${e.author.name}${e.author.role?` (${e.author.role})`:""}`:"",`> **Published:** ${(t=e.createdAt||new Date().toISOString())?new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):""}`,e.categories?.length?`> **Categories:** ${e.categories.map(e=>`\`${e}\``).join(", ")}`:""].filter(Boolean).join("\n"),i=(o=e.content,r=e.title,o.replace(RegExp(`^#\\s*${r}\\s*
`),"").trim().split("\n\n").map(e=>{if(e.startsWith("# "))return`

## ${e.slice(2)}
`;if(e.startsWith("## "))return`

### ${e.slice(3)}
`;if(e.startsWith("### "))return`

#### ${e.slice(4)}
`;if(e.match(/^[-*]\s/m))return e.split("\n").map(e=>{let t=e.match(/^\s*/),o=t?t[0].length:0;return o>0?`${" ".repeat(o)}- ${e.trim()}`:`- ${e.trim()}`}).join("\n");if(e.match(/^\d+\.\s/m))return e.split("\n").map((e,t)=>{let o=e.match(/^\s*/),r=o?o[0].length:0;return r>0?`${" ".repeat(r)}${t+1}. ${e.trim()}`:`${t+1}. ${e.trim()}`}).join("\n");if(e.startsWith("```")){let[t,...o]=e.split("\n"),r=t.slice(3).trim()||"plaintext";return`
\`\`\`${r}
${o.join("\n")}
\`\`\`
`}if(e.startsWith(">"))return e.split("\n").map(e=>e.startsWith(">")?e:`> ${e}`).join("\n")+"\n";if(e.includes("|")&&e.includes("\n")){let t=e.split("\n").filter(e=>e.trim());if(t.length>=2){if(!t[1].includes("|-")){let e=t[0].split("|").length-1;t.splice(1,0,`|${":---:|".repeat(e)}`)}return"\n"+t.join("\n")+"\n"}}return e.replace(/\*\*([^*]+)\*\*/g,"**$1**").replace(/\*([^*]+)\*/g,"*$1*").replace(/_([^_]+)_/g,"_$1_").replace(/`([^`]+)`/g,"`$1`").replace(/\[([^\]]+)\]\(([^)]+)\)/g,"[$1]($2)").replace(/~~([^~]+)~~/g,"~~$1~~").replace(/==([^=]+)==/g,"**$1**")}).join("\n\n")),s=(e=>{let t=e.match(/\n#+\s+.+/g)||[];if(t.length>2){let e=t.map(e=>{let t=e.match(/#+/),o=t?t[0].length-1:1,r=e.replace(/#+\s+/,"").trim(),a=r.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");return`${" ".repeat((o-1)*2)}- [${r}](#${a})`}).join("\n");return`
## Table of Contents

${e}

---

`}return""})(i);return`# ${e.title}

${n}

---
${s}${i}

---

<details>
<summary>Document Information</summary>

- Last updated: ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}
- Format: Markdown
- Content Type: ${a}
${e.categories?.length?`- Categories: ${e.categories.join(", ")}`:""}
</details>`}(o),a="text/markdown",n="md";break;case"pdf":r=c(o),a="text/html",n="pdf";break;default:throw Error("Unsupported export format")}let i=new Blob([r],{type:a});return new s.NextResponse(i,{headers:{"Content-Type":a,"Content-Disposition":`attachment; filename="${o.title}.${n}"`}})}catch(e){return console.error("Error exporting content:",e),s.NextResponse.json({error:"Failed to export content"},{status:500})}}function c(e){var t;return e.type.charAt(0).toUpperCase(),e.type.slice(1),`<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e.title} - GOV.UK</title>
  <link rel="stylesheet" href="https://www.gov.uk/assets/static/govuk-frontend-5.0.0.min.css">
  <style>
    :root {
      --gds-black: #0b0c0c;
      --gds-white: #ffffff;
      --gds-blue: #1d70b8;
      --gds-grey: #505a5f;
      --gds-green: #00703c;
      --gds-light-grey: #f3f2f1;
      --govuk-blue: #1d70b8;
    }
    
    body {
      margin: 0;
      padding: 0;
      background: var(--gds-white);
      font-family: "GDS Transport", arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* GOV.UK Header Styles */
    .govuk-header {
      background-color: #0b0c0c;
      padding: 10px 0;
      border-bottom: 10px solid #1d70b8;
    }

    .govuk-header__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .govuk-header__logo {
      display: flex;
      align-items: center;
    }

    .govuk-header__link--homepage {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }

    .govuk-header__logotype-crown {
      margin-right: 5px;
      fill: currentColor;
      height: 30px;
      width: 36px;
    }

    .govuk-header__logotype-text {
      color: white;
      font-family: "GDS Transport", arial, sans-serif;
      font-weight: 700;
      font-size: 30px;
      line-height: 1;
    }

    .govuk-header__menu-button {
      color: white;
      background: none;
      border: none;
      font-family: "GDS Transport", arial, sans-serif;
      font-size: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .govuk-header__menu-button svg {
      margin-left: 5px;
    }

    .govuk-header__search {
      display: flex;
      align-items: center;
    }

    .govuk-header__search-icon {
      color: white;
      height: 24px;
      width: 24px;
    }

    .govuk-blue-bar {
      background-color: #1d70b8;
      height: 10px;
      width: 100%;
    }

    .govuk-width-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 30px;
    }

    .app-content {
      padding: 30px 0;
    }

    .app-content__header {
      margin-bottom: 30px;
    }

    .app-content__body {
      font-size: 19px;
      line-height: 1.6;
      color: #0b0c0c;
    }

    .app-content__body h1 {
      font-size: 36px;
      font-weight: 700;
      margin: 30px 0 15px;
      color: #0b0c0c;
    }

    .app-content__body h2 {
      font-size: 27px;
      font-weight: 700;
      margin: 25px 0 15px;
      color: #0b0c0c;
    }

    .app-content__body h3 {
      font-size: 22px;
      font-weight: 700;
      margin: 20px 0 15px;
      color: #0b0c0c;
    }

    .app-content__body p {
      margin: 15px 0;
      font-family: "GDS Transport", arial, sans-serif;
    }

    .app-content__body ul,
    .app-content__body ol {
      margin: 15px 0;
      padding-left: 20px;
      font-family: "GDS Transport", arial, sans-serif;
    }

    .app-content__body li {
      margin: 5px 0;
    }

    .app-content__body code {
      font-family: monospace;
      background: #f3f2f1;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
    }

    .app-content__body pre {
      background: #f3f2f1;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 20px 0;
    }

    .app-content__body pre code {
      background: none;
      padding: 0;
    }

    .app-content__body blockquote {
      border-left: 4px solid #1d70b8;
      margin: 20px 0;
      padding: 15px 20px;
      background: #f3f2f1;
      font-style: italic;
    }

    .app-content__body a {
      color: #1d70b8;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
    }

    .app-content__body a:hover {
      text-decoration-thickness: 3px;
      color: #003078;
    }

    .app-content__body img {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
      border-radius: 5px;
    }

    .app-metadata {
      color: #505a5f;
      font-size: 16px;
      margin: 20px 0;
      font-family: "GDS Transport", arial, sans-serif;
    }

    .app-metadata__item {
      margin: 5px 0;
    }

    .app-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 20px 0;
    }

    .app-category {
      background: #f3f2f1;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      color: #0b0c0c;
    }

    @media print {
      body {
        font-size: 12pt;
      }
      
      .govuk-header,
      .govuk-footer,
      .govuk-blue-bar {
        display: none;
      }
    }

    .govuk-footer {
      padding: 25px 0;
      border-top: 1px solid #b1b4b6;
      color: #505a5f;
      font-size: 16px;
      line-height: 1.5;
      font-family: "GDS Transport", arial, sans-serif;
    }

    .govuk-footer__container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 30px;
    }

    .govuk-footer__meta {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .govuk-footer__inline-list {
      margin: 0 0 20px;
      padding: 0;
      list-style: none;
    }

    .govuk-footer__inline-list-item {
      display: inline-block;
      margin-right: 15px;
      margin-bottom: 10px;
    }

    .govuk-footer__link {
      color: #1d70b8;
      text-decoration: underline;
      font-family: "GDS Transport", arial, sans-serif;
    }

    .govuk-footer__link:hover {
      color: #003078;
      text-decoration-thickness: 3px;
    }

    .govuk-footer__licence {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 20px;
    }

    .govuk-footer__licence-logo {
      min-width: 41px;
      height: 17px;
      margin-top: 3px;
    }

    .govuk-footer__licence-description {
      font-size: 16px;
      line-height: 1.5;
      color: #505a5f;
    }

    .govuk-footer__copyright {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .govuk-footer__copyright-logo {
      display: inline-block;
      min-width: 125px;
      padding-top: 112px;
      background-image: url('https://www.gov.uk/assets/government-frontend/govuk-crest-795cd6b7da4a2efe0ffb973f525d2f2f3c9f2186d08a4dc75f42b6661df32d25.png');
      background-repeat: no-repeat;
      background-position: 50% 0;
      background-size: 125px 102px;
      text-align: center;
      text-decoration: none;
      color: #505a5f;
    }

    .govuk-heading-xl {
      font-family: "GDS Transport", arial, sans-serif;
      font-weight: 700;
      font-size: 36px;
      line-height: 1.1;
      margin-top: 30px;
      margin-bottom: 30px;
    }
  </style>
</head>
<body class="govuk-template__body">
  <!-- GOV.UK Header -->
  <header class="govuk-header" role="banner">
    <div class="govuk-header__container">
      <div class="govuk-header__logo">
        <a href="https://www.gov.uk" class="govuk-header__link govuk-header__link--homepage">
          <svg
            focusable="false"
            role="img"
            class="govuk-header__logotype"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 148 30"
            height="30"
            width="148"
            aria-label="GOV.UK"
            fill="white"
          >
            <title>GOV.UK</title>
            <path d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8m28.3-11.6c0 .9.1 1.7.3 2.5.2.8.6 1.5 1 2.2.5.6 1 1.1 1.7 1.5.7.4 1.5.6 2.5.6.9 0 1.7-.1 2.3-.4s1.1-.7 1.5-1.1c.4-.4.6-.9.8-1.5.1-.5.2-1 .2-1.5v-.2h-5.3v-3.2h9.4V28H55v-2.5c-.3.4-.6.8-1 1.1-.4.3-.8.6-1.3.9-.5.2-1 .4-1.6.6s-1.2.2-1.8.2c-1.5 0-2.9-.3-4-.8-1.2-.6-2.2-1.3-3-2.3-.8-1-1.4-2.1-1.8-3.4-.3-1.4-.5-2.8-.5-4.3s.2-2.9.7-4.2c.5-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.6 2.6-.8 4.1-.8 1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1s1.4.9 1.9 1.5c.6.6 1 1.3 1.4 2l-3.7 2.1c-.2-.4-.5-.9-.8-1.2-.3-.4-.6-.7-1-1-.4-.3-.8-.5-1.3-.7-.5-.2-1.1-.2-1.7-.2-1 0-1.8.2-2.5.6-.7.4-1.3.9-1.7 1.5-.5.6-.8 1.4-1 2.2-.3.8-.4 1.9-.4 2.7zM71.5 6.8c1.5 0 2.9.3 4.2.8 1.2.6 2.3 1.3 3.1 2.3.9 1 1.5 2.1 2 3.4s.7 2.7.7 4.2-.2 2.9-.7 4.2c-.4 1.3-1.1 2.4-2 3.4-.9 1-1.9 1.7-3.1 2.3-1.2.6-2.6.8-4.2.8s-2.9-.3-4.2-.8c-1.2-.6-2.3-1.3-3.1-2.3-.9-1-1.5-2.1-2-3.4-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2c.4-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.5 2.6-.8 4.2-.8zm0 17.6c.9 0 1.7-.2 2.4-.5s1.3-.8 1.7-1.4c.5-.6.8-1.3 1.1-2.2.2-.8.4-1.7.4-2.7v-.1c0-1-.1-1.9-.4-2.7-.2-.8-.6-1.6-1.1-2.2-.5-.6-1.1-1.1-1.7-1.4-.7-.3-1.5-.5-2.4-.5s-1.7.2-2.4.5-1.3.8-1.7 1.4c-.5.6-.8 1.3-1.1 2.2-.2.8-.4 1.7-.4 2.7v.1c0 1 .1 1.9.4 2.7.2.8.6 1.6 1.1 2.2.5.6 1.1 1.1 1.7 1.4.6.3 1.4.5 2.4.5zM88.9 28 83 7h4.7l4 15.7h.1l4-15.7h4.7l-5.9 21h-5.7zm28.8-3.6c.6 0 1.2-.1 1.7-.3.5-.2 1-.4 1.4-.8.4-.4.7-.8.9-1.4.2-.6.3-1.2.3-2v-13h4.1v13.6c0 1.2-.2 2.2-.6 3.1s-1 1.7-1.8 2.4c-.7.7-1.6 1.2-2.7 1.5-1 .4-2.2.5-3.4.5-1.2 0-2.4-.2-3.4-.5-1-.4-1.9-.9-2.7-1.5-.8-.7-1.3-1.5-1.8-2.4-.4-.9-.6-2-.6-3.1V6.9h4.2v13c0 .8.1 1.4.3 2 .2.6.5 1 .9 1.4.4.4.8.6 1.4.8.6.2 1.1.3 1.8.3zm13-17.4h4.2v9.1l7.4-9.1h5.2l-7.2 8.4L148 28h-4.9l-5.5-9.4-2.7 3V28h-4.2V7zm-27.6 16.1c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z"></path>
          </svg>
        </a>
      </div>
    </div>
  </header>

  <div class="govuk-width-container">
    <main class="app-content" id="main-content" role="main">
      <div class="app-content__header">
        <h1 class="govuk-heading-xl">${e.title}</h1>
        
        <div class="app-metadata">
          <div class="app-metadata__item">
            Published: ${(t=e.createdAt)?new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):""}
          </div>
          ${e.author?`
          <div class="app-metadata__item">
            From: <a href="#" class="govuk-link">${e.author.name}</a>
            ${e.author.role?`<br>${e.author.role}`:""}
          </div>
          `:""}
        </div>

        ${e.categories&&e.categories.length>0?`
        <div class="govuk-body">
          <strong class="govuk-!-font-weight-bold">Part of:</strong>
          ${e.categories.map(e=>`
            <a href="#" class="govuk-link govuk-!-margin-left-1">${e}</a>
          `).join(", ")}
        </div>
        `:""}
      </div>

      <div class="app-content__body govuk-body">
        ${((e,t)=>{let o=e.replace(RegExp(`^#\\s*${t}\\s*
`),"").trim(),r=e=>{let t=e.split("\n"),o=!1,r="",a=[],n=[];for(let e of t){let t=e.match(/^\s*[-*+]\s+(.*)/),i=e.match(/^\d+\.\s+(.*)/);if(t||i){o||(o=!0,r=t?"ul":"ol",a=[]);let e=t?t[1]:i[1];a.push(`<li>${e}</li>`)}else o&&(n.push(`<${r}>${a.join("\n")}</${r}>`),o=!1,a=[]),n.push(e)}return o&&n.push(`<${r}>${a.join("\n")}</${r}>`),n.join("\n")};return o.replace(/^[-]{3,}\s*$/gm,"").replace(/^(#+\s+.*?)\s*[-]{3,}\s*$/gm,"$1").replace(/^(.*?)\s*[-]{3,}\s*[-]{3,}\s*$/gm,"$1").replace(/^### (.*$)/m,"<h3>$1</h3>").replace(/^## (.*$)/m,"<h2>$1</h2>").replace(/^# (.*$)/m,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" class="govuk-link">$1</a>').replace(/```([\s\S]*?)```/g,(e,t)=>`<pre><code>${t.trim()}</code></pre>`).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/^>\s(.*)$/m,"<blockquote>$1</blockquote>").split("\n\n").map(e=>e.match(/^[-*+]\s/)||e.match(/^\d+\.\s/)?r(e):e).map(e=>{let t=e.trim();return t&&!t.startsWith("<")?`<p>${t}</p>`:t}).filter(e=>e.length>0).join("\n\n")})(e.content,e.title)}
      </div>
    </main>
  </div>

  <footer class="govuk-footer">
    <div class="govuk-footer__container">
      <div class="govuk-footer__meta">
        <ul class="govuk-footer__inline-list">
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.blog.gov.uk/all-blogs/">
              All GOV.UK blogs
            </a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.blog.gov.uk/all-posts/">
              All GOV.UK blog posts
            </a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.gov.uk">
              GOV.UK
            </a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.gov.uk/government/organisations">
              All departments
            </a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.blog.gov.uk/accessibility-statement/">
              Accessibility statement
            </a>
          </li>
          <li class="govuk-footer__inline-list-item">
            <a class="govuk-footer__link" href="https://www.blog.gov.uk/cookies/">
              Cookies
            </a>
          </li>
        </ul>

        <div class="govuk-footer__licence">
          <svg class="govuk-footer__licence-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.2 195.7" height="17" width="41">
            <path fill="currentColor" d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145"/>
          </svg>
          <span class="govuk-footer__licence-description">
            All content is available under the <a class="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence v3.0</a>, except where otherwise stated
          </span>
        </div>

        <div class="govuk-footer__copyright">
          <a class="govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">
            \xa9 Crown copyright
          </a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`}let p=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/export-content/route",pathname:"/api/export-content",filename:"route",bundlePath:"app/api/export-content/route"},resolvedPagePath:"C:\\Users\\Lokesh-PC\\Downloads\\ADO PL\\app\\api\\export-content\\route.ts",nextConfigOutput:"export",userland:r}),{workAsyncStorage:g,workUnitAsyncStorage:d,serverHooks:h}=p;function u(){return(0,i.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:d})}},6487:()=>{},8335:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[994,452],()=>o(2303));module.exports=r})();
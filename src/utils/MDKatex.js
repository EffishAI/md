const inlineRule = /^(?:\\\((.*?)\\\)|(\${1,2})(?!\$)((?:\\.|[^\\\n])*?)(?:\\.|[^\\\n$])\2)(?=[\s?!.,:？！。，：]|$)/

const inlineRuleNonStandard = /^(?:\\\((.*?)\\\)|(\${1,2})(?!\$)((?:\\.|[^\\\n])+?)\2)/

const blockRule = /^(?:\\\[((?:\\[\s\S]|[^\]])*?)\\\]|(\${2})\n((?:\\[\s\S]|[^\\])+?)\n\2)(?:\n|$)/

function createRenderer(display) {
  return (token) => {
    window.MathJax.texReset()
    const mjxContainer = window.MathJax.tex2svg(token.text, { display })
    const svg = mjxContainer.firstChild
    const width = svg.style[`min-width`] || svg.getAttribute(`width`)
    svg.removeAttribute(`width`)
    svg.style = `max-width: 300vw !important;`
    svg.style.width = width
    svg.style.display = `initial`
    if (display) {
      return `<section style="text-align: center; overflow: auto;">${svg.outerHTML}</section>`
    }
    return `<span style="vertical-align: middle; line-height: 1;">${svg.outerHTML}</span>`
  }
}

function inlineKatex(options, renderer) {
  const nonStandard = options && options.nonStandard
  const ruleReg = nonStandard ? inlineRuleNonStandard : inlineRule
  return {
    name: `inlineKatex`,
    level: `inline`,
    // start(src) {
    //   let index
    //   let indexSrc = src

    //   while (indexSrc) {
    //     index = indexSrc.indexOf(`$`)
    //     if (index === -1) {
    //       index = indexSrc.indexOf(`\(`)
    //       if (index === -1) {
    //         return
    //       }
    //     }
    //     const f = nonStandard ? index > -1 : index === 0 || indexSrc.charAt(index - 1) === ` `
    //     if (f) {
    //       const possibleKatex = indexSrc.substring(index)

    //       if (possibleKatex.match(ruleReg)) {
    //         return index
    //       }
    //     }

    //     indexSrc = indexSrc.substring(index + 1).replace(/^\$+/, ``).replace(/^\(/, ``)
    //   }
    // },
    start(src) {
      const index = src.search(/[$\\]/)
      if (index === -1) {
        return
      }
      return index
    },
    tokenizer(src) {
      const match = src.match(ruleReg)
      console.log(match)
      if (match) {
        return {
          type: `inlineKatex`,
          raw: match[0],
          text: (match[1] || match[3]).trim(),
          displayMode: match[2]?.length === 2 || false,
        }
      }
    },
    renderer,
  }
}

function blockKatex(options, renderer) {
  return {
    name: `blockKatex`,
    level: `block`,
    tokenizer(src) {
      const match = src.match(blockRule)
      if (match) {
        return {
          type: `blockKatex`,
          raw: match[0],
          text: (match[1] || match[3]).trim(),
          displayMode: !!match[1], // true if matched with \[
        }
      }
    },
    renderer,
  }
}

export function MDKatex(options = {}) {
  return {
    extensions: [
      inlineKatex(options, createRenderer(false)),
      blockKatex(options, createRenderer(true)),
    ],
  }
}

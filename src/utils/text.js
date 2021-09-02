export const convertDigitsToFarsi = (text) => {
  const numberDic = {
    0: '۰',
    1: '۱',
    2: '۲',
    3: '۳',
    4: '۴',
    5: '۵',
    6: '۶',
    7: '۷',
    8: '۸',
    9: '۹'
  }
  return String(text).replace(/[0123456789]/g, (s) => {
    return numberDic[s]
  })
}

export const convertDigitsToLatin = (text) => {
  var numberDic = {
    '۰': 0,
    '۱': 1,
    '۲': 2,
    '۳': 3,
    '۴': 4,
    '۵': 5,
    '۶': 6,
    '۷': 7,
    '۸': 8,
    '۹': 9
  }
  return text.replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (s) => {
    return numberDic[s]
  })
}

export const nl2br = (txt) => {
  var breakTag = '<br />'
  return (txt + '').replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    '$1' + breakTag + '$2'
  )
}

export const shortenText = (txt, limit) => {
  if (txt.length < limit - 1) {
    return txt
  }
  return `${txt.substring(0, limit)}…`
}

export const highlightTerms = (terms, text) => {
  let highlighted = text
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i]
    highlighted = highlighted.replace(new RegExp(term, 'gi'), (match) => {
      return '<mark class="highlight">' + match + '</mark>'
    })
  }
  return highlighted
}

export const email = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/
export const botToken = /^\d{9,12}:[\w-]{35,50}/
export const password = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}/
export const protocol = /(https?:\/\/[^\s]+)/g
export const www = /(\b(www):\/\/[-A-Z0-9+&@#%?=~_|!:,.;]*[-A-Z0-9+&@#%=~_|])/ig
export const hashtag = /#([A-Za-z0-9-_]+)/g
export const mention = /@([A-Za-z0-9_]{1,30})/g
export const url = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
export const passwordLength = /(?=.{8,})/
export const passwordNumber = /(?=.*[0-9])/
export const latinPassword = /(?=.*[a-zA-Z])/
export const persianPassword = /[\u0600-\u06FF]+/
export const correctPassword = /(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])/
export const persianCharacter = /[آ-ی ء چ]/
export const specialCharacter =  /[!@#$%^&*(),.?":{}|<>=-_/]/
export const persianNumber = /(?=.*[۰-۹])/
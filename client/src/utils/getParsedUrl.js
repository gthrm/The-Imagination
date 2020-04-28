import queryString from 'query-string'

const getParsedUrl = () => queryString.parse(window.location.search)

export const getActionFromParsedUrl = () => getParsedUrl().action

export const getHashFromParsedUrl =  () => getParsedUrl().h || getParsedUrl().H

export default getParsedUrl

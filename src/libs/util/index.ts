function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// eslint-disable-next-line
export { delay }

describe('basePath', () => {
  const original = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_PATH = original
    jest.resetModules()
  })

  const loadBasePath = async () => {
    let value: string
    await jest.isolateModulesAsync(async () => {
      ({ basePath: value } = await import('@/lib/config'))
    })
    return value!
  }

  it('reflects the build-time base path so runtime fetches match the deployment', async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/augmented-coding-patterns'
    expect(await loadBasePath()).toBe('/augmented-coding-patterns')
  })

  it('is empty for a root deployment', async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    expect(await loadBasePath()).toBe('')
  })

  it('falls back to empty when unset', async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH
    expect(await loadBasePath()).toBe('')
  })
})

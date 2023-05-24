const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

export async function fetchCount(amount = 1): Promise<{ data: number }> {
    const response = await fetch('/api/counter', {
        ...commonOptions,
        body: JSON.stringify({ amount }),
    })
    const result = await response.json()

    return result
}

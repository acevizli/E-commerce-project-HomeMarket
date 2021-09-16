export const formatPrice = (number) => {
    return new Intl.NumberFormat('en-US', {
      //style: 'currency',
      //currency: 'TRY',
    }).format(number)+ " ₺"
  }

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type])
  return ['all', ...new Set(unique)]
}

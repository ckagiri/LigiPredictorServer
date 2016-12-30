class DefaultSeasonConverter {
  constructor(public provider = "LIGI"){
  }
  from(obj: any) {
    return {
      api_detail: {
        [this.provider]: {
          id: obj.id
        }
      },
      name: obj.name,
      year: obj.year
    };
  }
}

export default DefaultSeasonConverter;
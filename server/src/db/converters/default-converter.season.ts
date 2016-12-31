class DefaultSeasonConverter {
  provider = 'LIGI';

  from(obj: any) {
    return {
      api_detail: {
        [this.provider]: {
          id: obj.slug
        }
      },
      slug: obj.slug,
      name: obj.name,
      year: obj.year
    };
  }
}

export default new DefaultSeasonConverter();
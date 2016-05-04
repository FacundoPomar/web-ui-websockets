function Comic(data) {
    var title = data.title || '',
        img = data.img || '',
        description = data.description || '',
        price = data.price || 0,
        id = data.id || 0;

    return {
        title: title,
        img: img,
        description: description,
        price: price,
        id: id
    }
}
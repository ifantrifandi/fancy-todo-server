function formatData(response){

    let data = []

    for(let i = 0 ; i < response.data.items.length ; i++){
        let tampunganLink = 'https://www.youtube.com/watch?v='
        if(response.data.items[i].id.videoId){
            tampunganLink += response.data.items[i].id.videoId
        }else{
            tampunganLink = `https://www.youtube.com/channel/${response.data.items[i].id.channelId}`
        }
        data.push(tampunganLink)
    }

    return data
}

module.exports = formatData
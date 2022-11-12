//make the paginated api
const DEFAULT_PAGE_LIMIT=50 //if page limit is 0 in mongo will return the all the data without pagination
const DEFAULT_PAGE_NUMBER=1
function getPagination(query){ 
    const  page=Math.abs(query.page)||DEFAULT_PAGE_NUMBER //if the query page is not define then default is 1
    const limit=Math.abs(query.limit)|| DEFAULT_PAGE_LIMIT //return position number and also convert the string to the number

const skip=(page-1)*limit
    return {
    skip,limit
}
}
module.exports={
    getPagination
}
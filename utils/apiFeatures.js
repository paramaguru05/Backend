

class ApiFeatures{

    constructor(query,queryString){
        this.query = query
        this.queryString = queryString 
        this.excludeField = ["sort",'field','limit','skip','page']
        this.includeField = {}
    }

    filter(){
        let queryStr = JSON.stringify( this.queryString )
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match)=>`$${match}`)
        let queryObj = JSON.parse( queryStr )

        this.excludeField.forEach((val)=>{
            if( queryObj[val] ){
                this.includeField[val] = queryObj[val]
                delete queryObj[val]
            }
        })

        console.log( queryObj )

        this.query = this.query.find(queryObj)
        return this
    }

    sort(){
        if(this.includeField.sort){
            let sort =  this.includeField.sort.split(',').join(' ')
            this.query = this.query.sort(sort)
        }
        return this
    }

    limitFields(){
        if(this.includeField.field){
            let field =  this.includeField.field.split(',').join(' ')
            this.query = this.query.select(field)
        }
        return this
    }

    limit(){
        if(this.includeField.limit){
            this.query = this.query.limit(this.includeField.limit)
           
        }
        return this
    }
    skip(){

        if( this.includeField.skip || this.includeField.page ){
            this.query = this.query.skip(this.includeField.page * this.includeField.limit)
        }
        return this
    }

}

module.exports = ApiFeatures
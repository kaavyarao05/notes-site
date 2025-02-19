const exp = require("constants")

var id=1
export function getId(){
    return(id++);
}

var notesDat=[ //fetch instead
    {
      title:"Test Title",
      preview:"Preview",
      color:"#ffcdd6",
      id:getId()
    },
    {
      title:"Test Title",
      preview:"Preview",
      color:"#9fffdf",
      id:getId()
    },
    {
      title:"Test Title",
      preview:"Preview",
      color:"#a7e9ff",
      id:getId()
    }
]

export function getNotes(){
    return notesDat;
}
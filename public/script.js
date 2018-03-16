var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    name: '',
    likes: 0,
    show: 'all',
    drag: {},
    sortedButtonPressed: false,
    // soulMate: '',
    // numItems: 0,
  },
  created: function() {
      this.getItems(); // should this be in created?
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	   return !item.completed;
      });
    },
   filteredItems: function() {
      if (this.sortedButtonPressed) {
          return this.items.sort((a, b) => { return b.priority - a.priority;});
      }      
      if (this.show === 'active')
  	      return this.items.filter(function(item) {
  	      return !item.completed;
  	  });
      if (this.show === 'completed')
	      return this.items.filter(function(item) {
	      return item.completed;
	     });
      return this.items;
    },
  },
  methods: {
    sortedPressed: function() {
      this.sortedButtonPressed = !this.sortedButtonPressed;
    },
    addItem: function() {
      axios.post("/api/items", {
	    text: this.text,
      name: this.name,
	    completed: false,
      likes: this.likes
      }).then(response => {
	     this.text = "";
       this.name = "";
       // numItems: numItems++;
       // console.log(numItems);
	     this.getItems();
	     return true;

      }).catch(err => {
      });
    },    
    Increment: function(item) {
        axios.put("/api/items/" + item.id, {   // indside here is the body
        text: item.text,
        name: item.name,
        likesChange: true,
        likes: item.likes,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },

    
    // findOut: function(name) {
    //   for (var i = 0; i < items.length; i++) {
    //     for (var j = 0; j < items[i].name.length; j++) {
    //       if ((items[i].name.charAt(j) == name.charAt(1)) && (items[i].name != name)) {
    //         soulMate: items[i].name;
    //       }
    //     }
    //   }
    //   soulMate: "You will be forever lonely";
    // },

    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
	   this.getItems();
	   return true;
      }).catch(err => {
      });
    },

    dragItem: function(item) {
      this.drag = item;
    },
    
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
	    text: this.drag.text,
      name: this.drag.name,
	    completed: this.drag.completed,
	    orderChange: true,
	    orderTarget: item.id,
      likes: this.drag.likes,
      }).then(response => {
	      this.getItems();
	      return true;
      }).catch(err => {
      });
    },

    getItems: function() {
      axios.get("/api/items").then(response => {
	    this.items = response.data;
	    return true;
      }).catch(err => {
      });
    },
  }
});

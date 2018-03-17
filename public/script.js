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
    soulMate: "",
    BFF: "",
    rating: "",
    married: "",
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

    
    findOut: function(name) {
      loop1:
      for (var i = 0; i < this.items.length; i++) {
        loop2:
        for (var j = 0; j < this.items[i].name.length; j++) {
          if (name.length != 0) {
            if ((this.items[i].name.charAt(j) == name.charAt(0))) {
                if ((this.items[i].name != name)) {
                this.soulMate =  this.items[i].name;
                break loop1;
              }
            }
            else {
              this.soulMate = "You will be forever lonely";
            }
          }
        }
      }
      //console.log(this.soulMate);
    },

    findBFF: function(name) {
      loop1:
      for (var i = 0; i < this.items.length; i++) {
        loop2:
        for (var j = 0; j < this.items[i].name.length; j++) {
          if (name.length != 0) {
            if ((this.items[i].name.charAt(j) == name.charAt(1))) {
                if ((this.items[i].name != name)) {
                this.BFF =  this.items[i].name;
                break loop1;
              }
            }
            else {
              this.BFF = "HA!! Nobody likes you.";
            }
          }
        }
      }
      //console.log(this.soulMate);
    },

    amIGoodLooking: function(rate) {
      rate = parseInt(rate);
      if (rate > 10) {
        this.married = "Because you lied, will never find her."; 
      }
      else if (rate > 8) {
        this.married = "You'll definitely find her."; 
      }
      else if (rate > 6) {
        this.married = "You'll have to work really hard, but eventually she'll show up."; 
      }
      else if (rate > 4) {
        this.married = "You''ll find someone, but remember, they aren't all first round picks."; 
      }
      else if (rate > 2) {
        this.married = "Chances are slim."; 
      }
      else {
        this.married = "Better luck next year."; 
      }
    },

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

var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: '',
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	     return this.items.filter(function(item) {
	       return !item.completed;
	     });
      if (this.show === 'completed')
	     return this.items.filter(function(item) {
	       return item.completed;
	     });
      if (this.show === 'high')
        return this.items.filter(function(item) {
          if(item.priority === 'High')
            return item;
      });
      if (this.show === 'med')
        return this.items.filter(function(item) {
          if(item.priority === 'Medium')
            return item;
      });
      if (this.show === 'low')
        return this.items.filter(function(item) {
          if(item.priority === 'Low')
            return item;
      });
      return this.items;
    },
  },
  
  methods: {
    getItems: function() {
      axios.get("/api/items").then(response => {
  this.items = response.data;
  return true;
      }).catch(err => {
      });
    },


    addItem: function() {
      console.log(this.priority);
      axios.post("/api/items", {
  text: this.text,
  priority: this.priority,
  completed: false
      }).then(response => {
  this.text = "";
  this.priority = "";
  this.getItems();
  return true;
      }).catch(err => {
      });
    },

    setHigh: function() {
      this.priority = "High";
      /*console.log(this.priority);*/
    },
    setMed: function() {
      this.priority = "Medium";
      /*console.log(this.priority);*/
    },
    setLow: function() {
      this.priority = "Low";
      /*console.log(this.priority);*/
    },
    
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
  text: item.text,
  priority: item.priority,
  completed: !item.completed,
  orderChange: false,
      }).then(response => {
  return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
  this.getItems();
  return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    showHigh: function() {
      this.show = 'high';
    },
    showMed: function() {
      this.show = 'med';
    },
    showLow: function() {
      this.show = 'low';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
  if (item.completed)
    this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
  text: this.drag.text,
  completed: this.drag.completed,
  orderChange: true,
  orderTarget: item.id
      }).then(response => {
  this.getItems();
  return true;
      }).catch(err => {
      });
    },
  }
});

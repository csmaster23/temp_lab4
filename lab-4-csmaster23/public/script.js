var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: '',
    sorted: false,
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
      /*if (this.sorted === true)
        return this.items.filter(function(item) {
          if(item.priority === 'High')
            return item;
          else if (item.priority === 'Medium')
            return item;
          else if (item.priority === 'Low')
            return item;
      });*/
      

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
    increment: function(item) {
      if (item.priority === "Medium") {
        console.log(item.priority);
        item.priority = "High";
        console.log(item.priority);
      }
      if (item.priority === "Low") {
        item.priority = "Medium";
      }

      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: item.completed,
  orderChange: false,
      }).then(response => {
        return true;
      }).catch(err => {
      });
    },
    decrement: function(item) {
      if (item.priority === "Medium") {
        console.log(item.priority);
        item.priority = "Low";
        console.log(item.priority);
      }
      if (item.priority === "High") {
        item.priority = "Medium";
      }

      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: item.completed,
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
    sortedFun: function() {
      /*console.log(this.sorted);*/
      this.sorted = true;
      var high = [];
      var med = [];
      var low = [];
      var a_length = this.items.length;
      for (i = 0; i < a_length; i++) {

        if (this.items[i].priority === 'High')
          high.push(this.items[i]);
        if (this.items[i].priority === 'Medium')
          med.push(this.items[i]);
        if (this.items[i].priority === 'Low')
          low.push(this.items[i]);
      }//end for
      var temp = [];
      var tempi = [];
      temp = high.concat(med);
      tempi = temp.concat(low);
      this.items = tempi;
      /*console.log(this.items);*/
      return this.items;

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




/*if (this.sorted === true) {
        var a_length = this.items.length;
        var temp;
        var tempi;
        var running = true;
        while (running) {
          for (i = 0; i < a_length; i++) {

            if (this.items[i].priority === 'High')
              continue;

            if (this.items[i].priority === 'Medium')
              if ((i+1) > a_length)
                continue;
              if (this.items[i+1].priority === 'High')
                temp = this.items[i];
                this.items[i] = this.items[i+1];
                this.items[i+1] = temp;

            if (this.items[i].priority === 'Low')
              if ((i+1) > a_length)
                continue;
              if (this.items[i+1].priority === 'Medium')
                tempi = this.items[i];
                this.items[i] = this.items[i+1];
                this.items[i+1] = tempi;
          }//end for
          for (i = 0; i < a_length; i++) {
            if ((i+1) > a_length)
                i = i-1;
            if (this.items[i].priority === 'Medium' && this.items[i+1].priority === 'High')
              continue;
            if (this.items[i].priority === 'Low' && this.items[i+1].priority === 'Medium')
              continue;
            if (this.items[i].priority === 'Low' && this.items[i+1].priority === 'High')
              continue;
            running = false;
            i = i + 1;
          }
        }//end while
        return this.items
      }//end if*/
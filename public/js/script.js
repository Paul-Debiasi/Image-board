// const { response } = require("express");

console.log('Sanity??')
Vue.component('my-component', {
  template: '#template',
  props: ['id'],
  data: function () {
    return {
      imageInfo: {
        url: '',
        title: '',
        username: '',
        description: '',
      },

      imageId: '',
      //   imageInfo: '',
      comment: '',
      username: '',
      comments: [],
    }
  },
  mounted: function () {
    var me = this
    console.log('imageSelected:', this.id)
    axios
      .get(`/image/${this.id}`)
      .then(function (response) {
        // console.log("mounted response:", response.data);
        me.imageInfo = response.data
      })
      .catch(function (err) {
        console.log('err in imageSelected', err)
      })
    axios
      .get(`/comments/${this.id}`)
      .then(function (response) {
        me.comments = response.data
        console.log('mounted1 response:', response.data)
      })
      .catch(function (err) {
        console.log('err in imageSelected', err)
      })
  },
  methods: {
    postComments: function (e) {
      e.preventDefault()
      var that = this
      let userComments = {}

      userComments.username = that.username
      userComments.comment = that.comment
      userComments.id = that.id
      axios
        .post('/comment', userComments)
        .then(function (response) {
          console.log('post from methods:', response)
          that.comments.unshift(response.data.rows)
        })
        .catch(function (err) {
          console.log('error in posting comments: ', err)
        })
    },
    changeName: function () {
      if (this.name) this.name = 'Pimento'
    },
    closeModal: function () {
      // console.log("closeModal run and about to Emit from component");
      this.$emit('close')
    },
    imageClicked: function () {
      var that = this
      imageSelected = true
      that.image.id = imageId
      console.log('image got clicked')
    },
  },
})

new Vue({
  el: '#main',
  data: {
    images: [],
    title: '',
    description: '',
    username: '',
    file: null,
    checkForSomething: true,
    sayGreeting: 'hello',
    imageSelected: false,
  },
  mounted: function () {
    // console.log("this.cities:", this.cities);
    var me = this
    axios.get('/image').then(function (response) {
      console.log('response:', response)
      me.images = response.data
    })
    // var me = this
    // axios
    //   .get(me.id)
    //   .then(function () {
    //     imageClicked()
    //   })
    //   .then(function (response) {
    //     me.image = response.data[0]
    //   })
    //   .catch(function (err) {
    //     console.log('err in imageSelected', err)
    //   })
  },
  methods: {
    handleClick: function (e) {
      e.preventDefault()
      // console.log("this:", this);
      // We're using formData because we are sending a file to the database
      var formData = new FormData()
      formData.append('title', this.title)
      formData.append('description', this.description)
      formData.append('username', this.username)
      formData.append('file', this.file)
      var that = this

      axios
        .post('/upload', formData)
        .then(function (response) {
          // console.log(
          //     "response from POST /upload:",
          //     response.data.image,
          // );
          // var res = response.data.image;
          // console.log("that.images:", that.images);
          that.images.unshift(response.data.rows)
          that.title = ''
          that.description = ''
          that.username = ''
          that.file = null
        })
        .catch(function (err) {
          console.log('error in POST /upload:', err)
        })
    },
    handleChange: function (e) {
      // console.log("handleChange is running");
      // console.log("file:", e.target.files[0]);
      this.file = e.target.files[0]
    },
    closeMePlease: function () {
      console.log('closeMePlease is running')
      // set the id to something falsy (null)
      this.$emit('close')
    },
    imageClicked: function (e) {
      this.imageSelected = e
      console.log('image got clicked:', e)
      // console.log("imageInfo :", this.imageInfo);
    },
  },
})

//methods:{
//  addComment	function()=>{
// 	this.comment.unshift(response.data.rows)
//  } whit this function I'm pushing in to my array. || On my html --> i can render dynamically my comment using v-on:keyup.enter = 'addComment'
// }

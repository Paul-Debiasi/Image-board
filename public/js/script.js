console.log("Sanity??");

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
    },
    mounted: function () {
        // console.log("this.cities:", this.cities);
        var me = this;
        axios.get("/images").then(function (response) {
            console.log("response:", response);
            me.images = response.data;
        });
    },
    methods: {
        handleClick: function (e) {
            e.preventDefault();
            // console.log("this:", this);
            // We're using formData because we are sending a file to the database
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            var that = this;

            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log(
                        "response from POST /upload:",
                        response.data.image,
                    );
                    // var res = response.data.image;
                    console.log("that.images:", that.images);
                    that.images.unshift(response.data.image);
                })
                .catch(function (err) {
                    console.log("error in POST /upload:", err);
                });
        },
        handleChange: function (e) {
            // console.log("handleChange is running");
            // console.log("file:", e.target.files[0]);
            this.file = e.target.files[0];
        },
    },
});

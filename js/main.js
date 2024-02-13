Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
    <div class="product-image">
           <img :src="image" :alt="altText"/>
       </div>

       <div class="product-info">
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
           
          <p v-if="inStock">In stock</p>
          <p v-else>Out of Stock</p>
         
          <a :href="link">More products like this</a>
          
          <ul>
            <li v-for="size in sizes">{{ size }}</li>
          </ul>
          
           <div
                   class="color-box"
                   v-for="(variant, index) in variants"
                   :key="variant.variantId"
                   :style="{ backgroundColor:variant.variantColor }"
                   @mouseover="updateProduct(index)"
           ></div>
           
           <button
                   v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }"
           >
               Add to cart
           </button>
           
           <button
                   v-on:click="removeFromCart"
           >
               Remove from cart
           </button>
           
           <product-tabs :reviews="reviews" :details="details" :premium="premium"></product-tabs>
           
       </div>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId, 'add');
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId, 'remove');
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        },
    },
    template: `
    <ul>
       <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `,
})

Vue.component('product-review', {
    // language=HTML
    template: `
   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length">
   <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>

     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>
    
     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>
    
     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>
     
     <p>Would you recommend this product?</p>
     <p><label for="yes">Yes</label><input type="radio" value="true" v-model="choise" id="yes">
         <label for="no">No</label><input type="radio" value="false" v-model="choise" id="no"></p>
       
     <p>
       <input type="submit" value="Submit"> 
     </p>
     </form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            choise: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    choise: this.choise
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.choise = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.choise) this.errors.push("Choise required.")
            }
        }

    }
})

Vue.component('product-shipping', {
    props: {
      premium: {
          type: Boolean,
          required: true
      }
    },
    template: `
    <p>Shipping: {{ shipping }}</p>
 `,
    data() {
        return {

        }
    },
    computed: {
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        details: {
            type: Array,
            required: true
        },
        reviews: {
            type: Array,
            required: false
        },
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
         <product-shipping :premium="premium"></product-shipping>
       </div>
       <div v-show="selectedTab === 'Details'">
         <product-details :details="details"></product-details>
       </div>
     </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
})

let eventBus = new Vue()

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id,type) {
            let removeID;
            if (type === 'add') {
                this.cart.push(id);
            } else if (type === 'remove') {
                for (let i = 0; i < this.cart.length; ++i ) {
                    if (this.cart[i] === id) {
                        removeID = i;
                        break;
                    }
                }
                if (removeID !== undefined) {
                    this.cart.splice(removeID, 1);
                }

            }
        }
    }
})




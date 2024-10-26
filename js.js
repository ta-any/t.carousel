const typical = {
	list_parametrs: {
				'touch': true,
				'dots': false,
				'arrows': false,
				'duration': 500,
				'index' : 0,
				'loop' : false,
	}, 
	styles: {
		wrapper: {
				'display': 'flex',
				'height': '95%',
				'position': 'absolute'},
		id: 	{ 
				'overflow': 'hidden',
				'position': 'relative',
				'display': 'flex'},
		touch: {
				"width": "100%",
				"position": "absolute",
				"height": "95%",
				"opacity": "0",
				"display": "flex",},
		footer: {
				"width": "100%",
				'align-items': 'end',
				'display': 'flex',
				'justify-content': 'space-between', },
	},
}

const Base = {
	__proto__ : typical,

	replaceDataset(data){
		for(let key in typical.list_parametrs){
			if(!data.hasOwnProperty(key)){
				data[key] = typical.list_parametrs[key]
			} 
		} 
		return data
	},
	wrapper(contents, wrapperName = 'wrapper'){ 
		let newWrapper = document.createElement('div');
		newWrapper.classList.add(wrapperName);

		contents.forEach((item) => newWrapper.appendChild(item))
		
		return newWrapper
	},
	append_to_style(html_element, styles){
		for(let name in styles){
			html_element.style[name] = styles[name]
		}
	},
	calculateTheWidth(content){
		let count = content.length
		let width = 0
		for (let i = 0; i < count; i++) {
			width += content[i].offsetWidth
		}
		return width
	},
	create_element(name){
		let DIV = document.createElement('div')
		DIV.classList.add(name)

		return DIV
	},
	add_html_block(basic, content, position){
		if(position == 'top'){
			basic.prepend(content)
		}
		if(position == 'bottom'){
			basic.append(content)
		}
		
	},
	get_array_elements(contents){
		let DIVs = document.createElement('div')
		contents.forEach((item) => DIVs.appendChild(document.createElement('div')))
		
		return DIVs
	},
	get_center_block(position){
		let list = [...position.children]
		if(list.length != 0){
			let index = list.length / 2 - 1
			return list[index]
		} else {
			return -1
		}
	},
	clone_content(block, content, place, count = 1){
		let clone = []

		for(let i = 1; count >= i; i++){
			content.forEach(element => {
				clone.push(element.cloneNode(true)) 
			})
		}

		clone.forEach(element => this.add_html_block(block, element, place))
	}
};

class Feature {
	start_shift = 0
	width = 0
	matrix = [] 
	status_index = 0
	core = 0

	constructor(content){
		this.content = content
		this.elements = [...this.content.block_carusele.children] 

		let line = []
		for (let i = 0; i < this.elements.length; i++) {
			line.push(i)
		}
		this.matrix.push(line)

	}
	builder(){ 
		this.width = this.content.calculateTheWidth(this.elements)

		if(this.content.data.loop){
			this.content.clone_content(this.content.block_carusele, [...this.content.block_carusele.children], 'bottom', 2)

			this.start_shift += this.width
			this.width = this.content.calculateTheWidth([...this.content.block_carusele.children])
			this.build_matrix('left')
			this.build_matrix('rigth')
		} 
		
		this.wrapper = this.content.wrapper([...this.content.block_carusele.children], 'wrapper')
		this.footer = this.content.create_element('footer')

		typical.styles.wrapper.left = `-${this.start_shift}px`
		typical.styles.wrapper.width = `${this.width}px`
		this.content.append_to_style(this.wrapper, typical.styles.wrapper)

		this.content.append_to_style(this.content.block_carusele, typical.styles.id )
		this.content.append_to_style(this.footer, typical.styles.footer)
		
	}
	render(){
		this.builder()
		
		this.content.add_html_block(this.content.block_carusele, this.wrapper, 'bottom')
		this.content.add_html_block(this.content.block_carusele, this.footer, 'bottom')

		this.event = new Event(this)
		this.start_option()
	}
	start_option(){
		for(let item in this.content.data){
			if(typeof this.content.data[item] == 'boolean' && this.content.data[item] == true){
				if(this.__proto__.hasOwnProperty(item)){
					this[item]()	
				}
			} else if(typeof this.content.data[item] == 'number'){
				if(this.__proto__.hasOwnProperty(item)){
					this[item](this.content.data[item])
				}
			}

		}
	}
	arrows(){	
		
		this.left = this.content.create_element('left')
		this.rigth = this.content.create_element('rigth')

		this.content.add_html_block(this.footer, this.left, 'top')
		this.content.add_html_block(this.footer, this.rigth , 'bottom')

		this.left.addEventListener('click', event => {
			this.event.move_to(this.status_index - 1)
		})

		this.rigth.addEventListener('click', event => {
			this.event.move_to(this.status_index + 1)
		})
	}
	dots(){
		let center = this.content.get_center_block(this.footer)
		let dots = this.content.get_array_elements(this.elements)
		dots.classList.add('dots')

		let list_dots = [...dots.children]
		list_dots.forEach(div => {
			div.classList.add('dot')
		})

		center != -1 ? center.after(dots) : this.footer.appendChild(dots)

		this.event.current_dot()

		list_dots.forEach(element => {
			element.addEventListener('click', event => {
				let index = list_dots.indexOf(event.target)

				this.event.move_to(index)
			})
		})
	}
	index(i){
		if(i > this.content.block_carusele.childElementCount){
			i = 0
		}

		this.event.change_block(i)
	}
	touch(){
		let list = this.content.get_array_elements(this.elements)
		list.classList.add('touch')
		let children_list = [...list.children]
		children_list.forEach(div => {
			this.content.append_to_style(div,  {
				"width": "100%",
				'display': 'block',})
		})
		this.content.append_to_style(list, typical.styles.touch)
		this.content.add_html_block(this.content.block_carusele, list, 'bottom')


		children_list.forEach(element => {
			element.addEventListener('mouseover', event => { 
				let index = children_list.indexOf(event.target)
				this.event.change_block(index)
			})
		})
	}
	build_matrix(side){
		let line = []
		for (let i = 0; i < this.elements.length; i++) {
			line.push(i)
		}

		if (side == 'left') {
			this.matrix.unshift(line)
			this.core += 1
			
		} else if(side == 'rigth') {
			this.matrix.push(line)
		}

		return this.matrix
	}
}

class Event {
	constructor(option){
		this.option = option
		this.sum = this.option.start_shift
	}
	animate(start, end){
		this.option.wrapper.animate([
		  {left:  start + 'px'},
		  {left:  end + 'px'}
		], {
		  duration: this.option.content.data.duration,
		  iterations: 1,
		});
	}
	change_status(index){
		this.option.status_index = index
	}
	change_block(index){
		this.sum = this.option.start_shift
		this.sum += [...this.option.wrapper.children][index].offsetWidth * index 
		this.option.content.append_to_style(this.option.wrapper, {
			left: `-${this.sum}px`
		})
		this.change_status(index)
		this.current_dot()
	}
	move_to(new_index){ 
		let start = -this.sum
		let step = Math.abs((this.option.status_index - new_index)) 
		
		if (new_index < this.option.status_index) {
			if(!this.option.content.data.loop){ 
				if (new_index < 0) {
					return this.sum
				} else {
					new_index
				}
			} else if (this.option.content.data.loop) {
				if(new_index < 0 ){
					this.option.core -= 1
					let last = this.option.matrix[this.option.core].length - 1
					new_index = last

					setTimeout(() => this.direction_to('left'), 0)
					
				} else {
					new_index
				}
			}	
			this.sum = this.sum - (this.option.elements[new_index].offsetWidth * step)		
		}

		else if(new_index > this.option.status_index){ 
			if (!this.option.content.data.loop) {
				if(new_index >= this.option.elements.length){
					return this.sum 
				} else {
					new_index
				}
			} else if(this.option.content.data.loop){
				if(new_index >= this.option.elements.length){
					this.option.core += 1
					let first = 0
					new_index = first 

					setTimeout(() => this.direction_to('rigth'), 0)
				} 
			}
	
				this.sum += (this.option.elements[new_index].offsetWidth * step)
		}

		this.change_status(new_index)
		this.current_dot()

		this.animate(start, -this.sum)
		this.option.content.append_to_style(this.option.wrapper, {
			left: `-${this.sum}px`
		})
	}

	current_dot(){
		if(this.option.content.data.dots){
			let array = [...document.querySelectorAll(`.dot`)]
			let index = this.option.status_index
			array.forEach(element => {
				element.classList.remove('current_dot')
			})
	
			array[index].classList.add('current_dot')
		}
	}

	direction_to(side){ 
		let shift = 0
		if (side == 'rigth') {
			this.option.core -= 1
			shift = this.option.start_shift
		} else if(side == 'left'){
			this.option.core += 1
			shift = (this.option.start_shift + this.option.content.calculateTheWidth(this.option.elements))  - [...this.option.elements][0].offsetWidth 
		}
		

		this.option.content.append_to_style(this.option.wrapper, {
			left: `-${shift}px`
		})
		this.sum = shift
	}

}

class Carusel {
	constructor(id, data){
		this.name_id = id
		this.data = this.replaceDataset(data)
		this.block_carusele = document.getElementById(this.name_id)
	}

	start(){
		this.s = new Feature(this)
		this.s.render()
	}
}

Object.assign(Carusel.prototype, Base);

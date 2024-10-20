let typical = {
	list_parametrs: {
				'touch': true,
				'dots': false,
				'arrows': false,
				'duration': 500,
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

let Base = {
	__proto__ : typical,

	replaceDataset(data){
		for(let key in typical.list_parametrs){
			if(!data.hasOwnProperty(key)){
				data[key] = typical.list_parametrs[key]
			} 
		} 
		return data
	},
	wrapper(position, contents, wrapperName = 'wrapper'){
		let newWrapper = document.createElement('div');
		newWrapper.classList.add(wrapperName);
		contents.forEach((item) => newWrapper.appendChild(item))
		position.appendChild(newWrapper)
	},
	append_to_style(html_element, styles){
		for(let name in styles){
			html_element.style[name] = styles[name]
		}
	},
	display_carusel(block){
		let content = [...block.children]
		this.width = this.calculateTheWidth(content)
		this.wrapper(block, content)

		let cls_wrapper = document.querySelector(`.wrapper`)
		let footer = this.add_html_block(block, [], 'bottom', 'footer')

		typical['styles']['wrapper']['width'] = `${this.width}px`
		this.append_to_style(cls_wrapper, typical['styles']['wrapper'])
		this.append_to_style(block, typical['styles']['id'])
	},
	calculateTheWidth(content){
		let count = content.length
		let width = 0
		for (let i = 0; i < count; i++) {
			width += content[i].offsetWidth
		}
		return width
	},
	add_html_block(basic, contents, position, blockName = 'addition'){
		let newElement = this.get_array_elements(contents);
		newElement.classList.add(blockName);
		
		this.append_to_style(newElement, typical['styles'][blockName])
		
		if(position == 'top'){
			basic.prepend(newElement)
		}
		if(position == 'bottom'){
			basic.append(newElement)
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
};

class Event {
	status_index = 0
	sum = 0
	constructor(option){
		this.option = option;
		this.list = [...this.option.wrapper_block.children]
	}
	change_img(index){
		this.sum = 0
		this.sum += this.list[index].offsetWidth * index
		this.option.content.append_to_style(this.option.wrapper_block, {
			left: `-${this.sum}px`
		})
		this.change_status_index(index)
		this.current_dot()
	}

	move_to(new_index){
		let start = -(this.list[this.status_index].offsetWidth * this.status_index)
		let step = Math.abs((this.status_index - new_index)) 

		if(new_index < this.status_index ){ 
			if(new_index == -1){
				return -1 
			} else {
				this.change_status_index(new_index)
				this.sum = this.sum - (this.list[this.status_index].offsetWidth * step)
				this.current_dot()
			}
		} else if(new_index > this.status_index){ 
			if(new_index >= this.list.length){
				return -1 
			} else {
				this.change_status_index(new_index)
				this.sum = this.sum + (this.list[this.status_index].offsetWidth * step)
				this.current_dot()
			}
		}

		this.animate(start, -this.sum)
		this.option.content.append_to_style(this.option.wrapper_block, {
			left: `-${this.sum}px`
		})
	}
	animate(start, end){
		this.option.wrapper_block.animate([
		  {left:  start + 'px'},
		  {left:  end + 'px'}
		], {
		  duration: this.option.content.data.duration, 
		  iterations: 1,
		});
	}
	change_status_index(index){
		this.status_index = index
	}

	current_dot(){
		if(this.option.content.data.dots){
			let array = [...document.querySelectorAll(`.dot`)]
			array.forEach(element => {
				element.classList.remove('current_dot')
			})
			array[this.status_index].classList.add('current_dot')
		}
	}
}

class Feature {  
	footer_block = document.querySelector(`.footer`)
	wrapper_block = document.querySelector(`.wrapper`)
	constructor(content){
		this.content = content
		this.event = new Event(this)
	}
	arrows(){	
		this.content.add_html_block(this.footer_block, [], 'top', 'left')
		this.content.add_html_block(this.footer_block, [], 'bottom', 'rigth')

		document.querySelector(`.left`).addEventListener('click', event => {
			this.event.move_to(this.event.status_index - 1)
		})

		document.querySelector(`.rigth`).addEventListener('click', event => {
			this.event.move_to(this.event.status_index + 1)
		})
	}
	dots(){
		let center = this.content.get_center_block(this.footer_block)
		let dots = this.content.get_array_elements([...this.wrapper_block.children])
		dots.classList.add('dots')

		let list_dots = [...dots.children]
		list_dots.forEach(div => {
			div.classList.add('dot')
		})

		center != -1 ? center.after(dots) : this.footer_block.appendChild(dots)

		this.event.current_dot()

		list_dots.forEach(element => {
			element.addEventListener('click', event => {
				let index = list_dots.indexOf(event.target)
				this.event.move_to(index)
				
				this.event.current_dot()
			})
		})
	}
	touch(){
		this.content.add_html_block(this.content.block_carusele, [...this.wrapper_block.children], 'bottom', 'touch')
		let list = [...document.querySelector(`.touch`).children]
		list.forEach(div => {
			this.content.append_to_style(div,  {
				"width": "100%",
				'display': 'block',})
		})

		list.forEach(element => {
			element.addEventListener('mouseover', event => {
				let index = list.indexOf(event.target)
				this.event.change_img(index)
			})
		})
	}
	index(i){
		if(i > this.content.block_carusele.childElementCount){
			i = 0
		}
		
		this.event.change_status_index(i)
		this.event.change_img(i)
	}
}


class Carusel{
	constructor(id, data){
		this.name_id = id
		this.data = this.replaceDataset(data)
		this.block_carusele = document.getElementById(this.name_id)
	}
	append_style_to(elements, style){
		let block = [...document.querySelectorAll(elements)]
		block.forEach(div => {
			this.append_to_style(div, style)
		})
	}
	start(){
		this.display_carusel(this.block_carusele)
		let s = new Feature(this)

		for(let item in this.data){
			if(typeof this.data[item] == 'boolean' && this.data[item] == true){
				s[item]()
			} else if(typeof this.data[item] == 'number'){
				if(s.__proto__.hasOwnProperty(item)){
					s[item](this.data[item])
				}
			} 
		}
	}
}

Object.assign(Carusel.prototype, Base);

// mesh.js

(function() {
	
	var VertexBuffer = function(gl, values) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		
		this.gl = gl;
		this.handler = buffer;
		this.values = values;
		this.size = values.byteLength;
	};

	VertexBuffer.prototype.destroy = function() {
		this.gl.deleteBuffer(this.handler);
	};
	
	VertexBuffer.prototype.bind = function() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.handler);
	};
	
	VertexBuffer.prototype.unbind = function() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	};
	
	var IndexBuffer = function(gl, values) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, values, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
		this.gl = gl;
		this.handler = buffer;
		this.values = values;
		this.size = values.byteLength;
	};
	
	IndexBuffer.prototype.destroy = function() {
		this.gl.deleteBuffer(this.handler);
	};
	
	IndexBuffer.prototype.bind = function() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.handler);
	};
	
	IndexBuffer.prototype.unbind = function() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	};
	
	var VertexAttribute = function(gl, name, size, normalized, stride, offset, values) {
		this.gl = gl;
		this.name = name;
		this.size = size;
		this.normalized = normalized;
		this.stride = stride;
		this.offset = offset;
		this.buffer = new VertexBuffer(gl, values);
	};
	
	VertexAttribute.prototype.destroy = function() {
		this.buffer.destroy();
	};
	
	VertexAttribute.prototype.bind = function(index) {
		this.buffer.bind();
		this.gl.vertexAttribPointer(index, this.size, this.gl.FLOAT, 
																this.normalized, this.stride, this.offset);
	};
	
	VertexAttribute.prototype.unbind = function() {
		this.buffer.unbind();
	};
	
	var FlatTopology = function(gl, name, primitive, first, count) {
		this.gl = gl;
		this.name = name;
		this.primitive = primitive;
		this.first = first;
		this.count = count;
	};
	
	FlatTopology.prototype.destroy = function() {
		;
	};
	
	FlatTopology.prototype.bind = function() {
		;
	};
	
	FlatTopology.prototype.unbind = function() {
		;
	};
	
	FlatTopology.prototype.render = function() {
		this.gl.drawArrays(this.primitive, this.first, this.count);
	};
	
	var IndexedTopology = function(gl, name, primitive, values) {
		this.gl = gl;
		this.name = name;
		this.primitive = primitive;
		this.size = values.length;
		this.buffer = new IndexBuffer(gl, values);
	};

	IndexedTopology.prototype.destroy = function() {
		this.buffer.destroy();
	};

	IndexedTopology.prototype.bind = function() {
		this.buffer.bind();
	};
	
	IndexedTopology.prototype.unbind = function() {
		this.buffer.unbind();
	};
	
	IndexedTopology.prototype.render = function() {
		this.gl.drawElements(this.primitive, this.size, this.gl.UNSIGNED_SHORT, 0);
	};
	
	var AttributeStream = function(gl) {
		this.gl = gl;
		this.size = 0;
		this.attributes = {};
	};
	
	AttributeStream.prototype.destroy = function() {
		for (var a in this.attributes) {
			this.attributes[a].destroy();
		}
	};
	
	AttributeStream.prototype.addAttribute = function(name, size, normalized, values) {
		var stride = 0,
				offset = 0,
				att = new VertexAttribute(this.gl, name, size, normalized, stride, offset, values);
		this.attributes[name] = att;
		this.size = values.length / size;
	};
	
	var TopologyStream = function(gl) {
		this.gl = gl;
		this.topologies = {};
	};
	
	TopologyStream.prototype.destroy = function() {
		for (var t in this.topologies) {
			this.topologies[t].destroy();
		}
	};
	
	TopologyStream.prototype.addFlatTopology = function(name, primitive, start, count) {
		this.topologies[name] = new FlatTopology(this.gl, name, primitive, start, count);
	};
	
	TopologyStream.prototype.addIndexedTopology = function(name, primitive, values) {
		this.topologies[name] = new IndexedTopology(this.gl, name, primitive, values);
	};
	
	var Mesh = function(gl) {
		this.gl = gl;
		this.astream = new AttributeStream(gl);
		this.tstream = new TopologyStream(gl);
	};
	
	Mesh.prototype.destroy = function() {
		this.astream.destroy();
		this.tstream.destroy();
	};
	
	Mesh.prototype.addAttribute = function(name, size, normalized, values) {
		this.astream.addAttribute(name, size, normalized, values);
	};
	
	Mesh.prototype.addFlatTopology = function(name, primitive, start, count) {
		this.tstream.addFlatTopology(name, primitive, start, count);
	};
	
	Mesh.prototype.addIndexedTopology = function(name, primitive, values) {
		this.tstream.addIndexedTopology(name, primitive, values);
	};
	
	Mesh.prototype.bind = function(program) {
		var attribute, buffer, index;

		for (var a in program.attributes) {
			attribute = program.attributes[a];
			buffer = this.astream.attributes[attribute.name];
			index = attribute.getIndex();
			program.gl.enableVertexAttribArray(index);
			if (buffer) {
				buffer.bind(index);
			}
		}	
	};
	
	Mesh.prototype.unbind = function(program) {
		var attribute, buffer, index;
		
		for (var a in program.attributes) {
			var attribute = program.attributes[a];
			var buffer = this.astream.attributes[attribute.name];
			index = attribute.getIndex();
			if (buffer) {
				buffer.unbind(index);
			}
			program.gl.disableVertexAttribArray(index);
		}	
	};
	
	Mesh.prototype.draw = function(primitives) {
		var prim = this.tstream.topologies[primitives];
		if (prim) {
			prim.bind();
			prim.render();
			prim.unbind();
		}	
	};
	
	Mesh.prototype.render = function(program, primitives) {
		this.bind(program);
		this.draw(primitives);
		this.unbind(program);
	};

	BenchGL.Mesh = Mesh;

})();


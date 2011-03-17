//
//  Bench - A WebGL-based javascript graphic engine.
//  Copyright (c) 2010 Matteo Meli.  
//


/**
 * Creates a new VertexBuffer.
 * @class Wraps an array of vertices in a WebGLBuffer object. A VertexBuffer
 * contains vertex data that will be rendered using non-indexed primitives.
 */
function VertexBuffer(gl, values) {
	var obj = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, obj);
	gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	this.gl = gl;
	this._obj = obj;
	this._valid = true;
	this._values = values;
	this._size = values.byteLength;
};

/**
 * Getters.
 */
VertexBuffer.prototype = {
	get buffer() { return this._obj; },
	get isValid() { return this._valid; },
	get values() { return this._values; },
	get size() { return this._size; },
};

/**
 * Deletes the WebGL buffer object of this VertexBuffer.
 */
VertexBuffer.prototype.destroy = function() {
	if (this._valid)
		this.gl.deleteBuffer(this._obj);
};

/**
 * Binds the WebGLBuffer object of this VertexBuffer.
 */
VertexBuffer.prototype.bind = function() {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._obj);
};

/**
 * Unbinds the WebGLBuffer object of this VertexBuffer.
 */
VertexBuffer.prototype.unbind = function() {
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
};


/**
 * Creates a new IndexBuffer.
 * @class Wraps an array of indices in a WebGLBuffer object. An IndexBuffer
 * contains index data that will be used to render indexed primitives.
 */
function IndexBuffer(gl, values) {
	var obj = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, values, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	this.gl = gl;
	this._obj = obj;
	this._valid = true;
	this._values = values;
	this._size = values.byteLength;
};

/**
 * Getters.
 */
IndexBuffer.prototype = {
	get buffer() { return this._obj; },
	get isValid() { return this._valid; },
	get values() { return this._values; },
	get size() { return this._size; },
};

/**
 * Deletes the WebGL buffer object of this IndexBuffer.
 */
IndexBuffer.prototype.destroy = function() {
	if (this.valid)
		this.gl.deleteBuffer(this._obj);
};

/**
 * Binds the WebGLBuffer object of this IndexBuffer.
 */
IndexBuffer.prototype.bind = function() {
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._obj);
};

/**
 * Unbinds the WebGLBuffer object of this IndexBuffer.
 */
IndexBuffer.prototype.unbind = function() {
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
};


/**
 * Creates a new VertexAttribute.
 * @class Wraps an array to be attached to an attribute in a 
 * WebGLShader object. The data are stored in a VertexBuffer variable.
 */
function VertexAttribute(gl, name, size, normalized, stride, offset, values) {
	this.gl = gl;
	this._name = name;
	this._size = size;
	this._normalized = normalized;
	this._stride = stride;
	this._offset = offset;
	this._buffer = new VertexBuffer(gl, values);
};

/**
 * Getters.
 */
VertexAttribute.prototype = {
	get name() { return this._name; },
	get size() { return this._size; },
	get isNormalized() { return this._normalized; },
	get stride() { return this._stride; },
	get offset() { return this._offset; },
	get buffer() { return this._buffer; },
};

/**
 * Destroys this VertexAttribute, deleting the VertexBuffer.
 */
VertexAttribute.prototype.destroy = function() {
	this._buffer.destroy();
};

/**
 * Binds the VertexBuffer to its attribute variable in the shader program.
 */
VertexAttribute.prototype.bind = function(index) {
	this._buffer.bind();
	this.gl.vertexAttribPointer(index, this._size, this.gl.FLOAT, this._normalized, this._stride, this._offset);
};

/**
 * Unbinds this VertexAttribute unbinding the VertexBuffer.
 */
VertexAttribute.prototype.unbind = function() {
	this._buffer.unbind();
};


/**
 * Creates a new FlatTopology.
 * @class Represents a non-indexed WebGL rendering primitive.
 */
function FlatTopology(gl, name, primitive, first, count) {
	this.gl = gl;
	this._name = name;
	this._primitive = primitive;
	this._first = first;
	this._count = count;
};

/**
 * Getters.
 */
FlatTopology.prototype = {
	get name() { return this._name; },
	get primitive() { return this._primitive; },
	get first() { return this._first; },
	get count() { return this._count; },
};

/**
 * Destroys this IndexPrimitive, deleting the IndexBuffer.
 */
FlatTopology.prototype.destroy = function() {
	;
};

/**
 * Binds the IndexBuffer of this IndexPrimitive.
 */ 
FlatTopology.prototype.bind = function() {
	;
};

/**
 * Unbinds the IndexBuffer of this primitive.
 */
FlatTopology.prototype.unbind = function() {
	;
};

/**
 * Renders all the elements in the attribute arrays currently enabled.
 */
FlatTopology.prototype.render = function() {
	this.gl.drawArrays(this._primitive, this._first, this._count);
};


/**
 * Creates a new IndexedTopology.
 * @class Represents an indexed WebGL rendering primitive.
 * The indices data are stored in an IndexBuffer object.
 */
function IndexedTopology(gl, name, primitive, values) {
	this.gl = gl;
	this._name = name;
	this._primitive = primitive;
	this._size = values.length;
	this._buffer = new IndexBuffer(gl, values);
};

/**
 * Getters.
 */
IndexedTopology.prototype = {
	get name() { return this._name; },
	get primitive() { return this._primitive; },
	get size() { return this._size; },
	get buffer() { return this._buffer; },
};

/**
 * Destroys this IndexedTopology, deleting the IndexBuffer.
 */
IndexedTopology.prototype.destroy = function() {
	this._buffer.destroy();
};

/**
 * Binds the IndexBuffer of this IndexedTopology.
 */ 
IndexedTopology.prototype.bind = function() {
	this._buffer.bind();
};

/**
 * Unbinds the IndexBuffer of this primitive.
 */
IndexedTopology.prototype.unbind = function() {
	this._buffer.unbind();
};

/**
 * Renders all the indices in the attribute arrays currently enabled.
 */
IndexedTopology.prototype.render = function() {
	this.gl.drawElements(this._primitive, this._size, this.gl.UNSIGNED_SHORT, 0);
};


/**
 * Creates a new AttributeStream.
 * @class Holds the attributes arrays for a Mesh object.
 */
function AttributeStream(gl) {
	this.gl = gl;
	this._size = 0;
	this._attributes = new Object();
};

/**
 * Getters.
 */
AttributeStream.prototype = {
	get size() { return this._size; },
	get attributes() { return this._attributes; },
};

/**
 * Destroys this AttributeStream and its AttributeArrays.
 */
AttributeStream.prototype.destroy = function() {
	for (var a in this._attributes) {
		this._attributes[a].destroy();
	}
};

/**
 * Adds an attribute array to this AttributeStream.
 * @param {String} name The name for this attribute.
 * @param {Number} size The size of an element for this attribute.
 * @param {Number} type The type of the elements of this attribute.
 * @param {Boolean} normalized Are the values to be normalized?
 * @param {WebGLArray} values The typed WebGLArray of the attribute array values.
 */
AttributeStream.prototype.addAttribute = function(name, size, normalized, values) {
	var stride = 0;
	var offset = 0;
	var a = new VertexAttribute(this.gl, name, size, normalized, stride, offset, values);
	this._attributes[name] = a;
	this._size = values.length / size;
};


/**
 * Creates a new TopologyStream.
 * @class Holds the primitives for a Mesh object.
 */
function TopologyStream(gl) {
	this.gl = gl;
	this._topologies = new Object();
};

/**
 * Getters.
 */
TopologyStream.prototype = {
	get topologies() { return this._topologies; },
};

/**
 * Destroys this TopologyStream and all the attached primitives.
 */
TopologyStream.prototype.destroy = function() {
	for (var i in this._topologies) {
		this._topologies[i].destroy();
	}
};

/**
 * Adds an ArrayPrimitive.
 * @param {String} name The name of this primitive. 
 * @param {Number} primitive The primitive kind.
 * @param {Number} start The starting element of the primitive.
 * @param {Number} count The elements count of the primitive
 */
TopologyStream.prototype.addFlatTopology = function(name, primitive, start, count) {
	this._topologies[name] = new FlatTopology(this.gl, name, primitive, start, count);
};

/**
 * Adds an IndexPrimitive.
 * @param {String} name The name of this primitive. 
 * @param {Number} primitive The primitive kind.
 * @param {Number} type The index type of the primitive.
 * @param {WebGLArray} count The WebGL indices array of the primitive.
 */
TopologyStream.prototype.addIndexedTopology = function(name, primitive, values) {
	this._topologies[name] = new IndexedTopology(this.gl, name, primitive, values);
};


/**
 * Creates a new Mesh. A Mesh is a WebGL representation of a geometric mesh.
 * @class Contains information about vertices in the form of a VertexStream and
 * .
 */
function Mesh(gl) {
	this.gl = gl;
	this._astream = new AttributeStream(gl);
	this._tstream = new TopologyStream(gl);
};

/**
 * Getters and setters.
 */
Mesh.prototype = {
	get attributeStream() { return this._astream; },
	get topologyStream() { return this._pstream; }
};	

/**
 * Destroys this Mesh deleting both the VertexStream and the PrimitiveStream.
 */
Mesh.prototype.destroy = function() {
	this._astream.destroy();
	this._tstream.destroy();
};

/**
 * Adds a vertex attribute to this Mesh.
 * @param {String} name The name for this attribute.
 * @param {Number} size The size of an element for this attribute.
 * @param {Boolean} normalized Are the values to be normalized?
 * @param {WebGLArray} values The typed WebGLArray of the attribute array values.
 */
Mesh.prototype.addAttribute = function(name, size, normalized, values) {
	this._astream.addAttribute(name, size, normalized, values);
};

/**
 * Adds a simple non-indexed array primitive.
 * @param {String} name The name of this primitive. 
 * @param {Number} primitive The primitive kind.
 * @param {Number} start The starting element of the primitive.
 * @param {Number} count The elements count of the primitive
 */
Mesh.prototype.addFlatTopology = function(name, primitive, start, count) {
	this._tstream.addFlatTopology(name, primitive, start, count);
};

/**
 * Adds an indexed primitive.
 * @param {String} name The name of this primitive. 
 * @param {Number} primitive The primitive kind.
 * @param {WebGLArray} count The WebGL indices array of the primitive.
 */
Mesh.prototype.addIndexedTopology = function(name, primitive, values) {
	this._tstream.addIndexedTopology(name, primitive, values);
};

/**
 * Render this Mesh.
 * @param {Program} program The program in the current rendering state. 
 * @param {String} primitives The primitives to render. 
 */
Mesh.prototype.render = function(program, primitives) {
	// Enable attribute arrays
	for (var a in program.attributes) {
		var attribute = program.attributes[a];
		program.gl.enableVertexAttribArray(attribute.index);
	}
	
	// Bind the attributes to their location
	for (var a in program.attributes) {
		var attr = program.attributes[a];
		var vattr = this._astream.attributes[attr.name];
		if (vattr) vattr.bind(attr.index);
	}
	
	// Get the required primitive
	var prim = this._tstream.topologies[primitives];
	if (prim) {
		// Bind the primitive topology
		prim.bind();
	
		// Render
		prim.render();
	
		// Unbind the primitive
		prim.unbind();
	}
	
	// Unbinds the attributes from their location
	for (var a in program.attributes) {
		var attr = program.attributes[a];
		var vattr = this._astream.attributes[attr.name];
		if (vattr) vattr.unbind(attr.index);
	}
	
	// Disable attribute arrays
	for (var a in program.attributes) {
		var attribute = program.attributes[a];
		program.gl.disableVertexAttribArray(attribute.index);
	}
};

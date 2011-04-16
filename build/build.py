path = '../src/'

files = [
  'bench.js',
  'math.js',
  'webgl.js',
  'trans.js',
  'skin.js',
  'request.js',
  'mesh.js',
  'model.js',
  'worker.js',
  'canvas.js',
  'camera.js',
  'shader.js',
  'program.js',
  'renderer.js',
  'timer.js',
  'logger.js'
]

def build():
  body = []
  license = open('../LICENSE', 'r').read()
  for file in files:
    body.append(open(path + file, 'r').read())
  print '/**\n@preserve' + license + '*/\n\n' + '(function() { \n' + '\n'.join(body) + '\n})();'

if __name__ == '__main__':
  build()
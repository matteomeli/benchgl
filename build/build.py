path = '../src/'

files = [
	'core.js',
  'utils.js',
  'math.js',
  'space.js',
  'skin.js',
  'io.js',
  'ui.js',
  'worker.js',
  'shader.js',
  'program.js',
  'model.js',
  'renderer.js',
  'bench.js'
]

def build():
  body = []
  license = open('../LICENSE', 'r').read()
  for file in files:
    body.append(open(path + file, 'r').read())
  print '/**\n@preserve' + license + '*/\n'
# Use this in case of avoiding globals completely...
# print 'var BenchGL = BenchGL || {};\n'
  print '(function() {\n\n' + '\n'.join(body) + '\n}());'

if __name__ == '__main__':
  build()

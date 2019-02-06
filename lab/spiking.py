import resource
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
plt.switch_backend('agg')

with tf.name_scope('parameters'):
    n = tf.constant(10, name='n', dtype=tf.int32)
    dt = tf.constant(1.0, name='dt')
    a = tf.fill([n], 0.02)
    b = tf.fill([n], 0.2)
    c = tf.fill([n], -65.0)
    d = tf.fill([n], 8.0)
    resting_v = tf.constant(-70.0)
    threshold_v = tf.constant(35.0)


with tf.name_scope('neurons'):
    v = tf.Variable(tf.fill([n], resting_v), name="potential")
    u = tf.Variable(b * c, name="recovery")


with tf.name_scope('synapses'):
    n_s = tf.constant(10, name='n_s', dtype=tf.int32)
    prepost = tf.Variable(tf.random_uniform(
        [tf.cast(n_s, tf.int64), 2], 0, tf.cast(n, tf.int64), dtype=tf.int64), dtype=tf.int64)
    s = tf.SparseTensor(prepost, tf.fill([n_s], 1), dense_shape=[
                        tf.cast(n, tf.int64), tf.cast(n, tf.int64)])
    w = tf.constant(30.0)

with tf.name_scope('input'):
    i_in = tf.constant([0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                       dtype=tf.float32, name="input_current")
    i_op = tf.assign(v, v + i_in)

with tf.name_scope('fire'):
    # firing_op = s * tf.transpose(tf.greater(v, 30.0))
    firing_op = s * tf.cast(tf.greater(v, 30.0), tf.int32)
    potentiate_op = tf.assign(v, tf.sparse_add(
        tf.sparse_matmul(tf.cast(firing_op, tf.float32), v), v))
    hyperpolarize_op = tf.assign(
        v, tf.where(tf.greater(v, 30.0), resting_v, v))

with tf.name_scope('update'):
    dv_op = 0.04 * v * v + 5.0 * v + 140.0 - u
    du_op = a * (b * v - u)
    v_op = tf.assign(v, v + dv_op * dt)
    u_op = tf.assign(u, u + du_op * dt)


init = tf.global_variables_initializer()

T = 5
t_step = 1
t = 0
v_out = []
feed = {}

with tf.Session() as sess:
    writer = tf.summary.FileWriter("./graphs", sess.graph)
    sess.run(init)
    for step in range(int(T / t_step)):
        t += t_step
        v, u = sess.run([u_op, v_op, potentiate_op, i_op], feed)
        v_out.append((t, v))

writer.close()

fig = plt.figure()
plt.plot(*zip(*v_out))
try:
    fig.savefig('/home/jupyter/fig.png')
except:
    fig.savefig('fig.png')

print("{} Kb".format(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss))

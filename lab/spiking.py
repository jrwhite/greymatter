import resource
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
plt.switch_backend('agg')

with tf.name_scope('parameters'):
    n = tf.constant(1, name='n')
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


with tf.name_scope('update'):
    dv_op = 0.04 * v * v + 5.0 * v + 140.0 - u
    du_op = a * (b * v - u)
    v_op = tf.assign(v, v + dv_op * dt)
    u_op = tf.assign(u, u + du_op * dt)


init = tf.global_variables_initializer()

T = 1000
t_step = 1
t = 0
v_out = []

with tf.Session() as sess:
    writer = tf.summary.FileWriter("./graphs", sess.graph)
    sess.run(init)
    for step in range(int(T / t_step)):
        t += t_step
        v, u = sess.run([u_op, v_op])
        v_out.append((t, v))


writer.close()

fig = plt.figure()
plt.plot(*zip(*v_out))
fig.savefig('/home/jupyter/fig.png')

print("{} Kb".format(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss))

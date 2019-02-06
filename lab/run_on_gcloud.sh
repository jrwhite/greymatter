#!/bin/bash
echo "Copying spiking.py to server"
gcloud compute scp spiking.py tensorflow-spiking-test-vm:/home/jarod/spiking.py
echo "File copied successfully"
echo "Running spiking.py"
gcloud compute ssh jarod@tensorflow-spiking-test-vm --command="python spiking.py"
echo "Retrieving fig.png"
gcloud compute scp tensorflow-spiking-test-vm:/home/jarod/fig.png fig.png
echo "fig.png retrieved"

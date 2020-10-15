FROM jupyter/scipy-notebook
COPY  setup.py ./work
COPY requirements.txt ./work
RUN cd work && pip install -r requirements.txt && \
    fix-permissions $CONDA_DIR && \
    fix-permissions /home/$NB_USER
COPY . ./work
CMD ["start.sh", "jupyter","notebook","--NotebookApp.token=''"]
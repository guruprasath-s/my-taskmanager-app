import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  commentList: {
    padding: theme.spacing(3),
  },
  textField: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  commentTitle: {
    color: "#757575",
    paddingBottom: theme.spacing(1),
  },
  comment: {
    color: "#212121",
  },
  commentDate: {
    padding: theme.spacing(1),
    color: "#37474f",
    fontSize: "12px",
    float: "right",
  },
}));

export default function EditTaskFormDialog({
  open,
  handleClose,
  task,
  handleSave,
  handleAddComment,
}) {
  const classes = useStyles();
  const [name, setName] = useState(task.name);
  const [desc, setDesc] = useState(task.description);
  const [comment, setComment] = useState("");
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Task </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Task Name*"
            type="text"
            value={name}
            error={!name}
            helperText={name ? "" : "Please provide a task name"}
            onChange={handleNameChange}
            fullWidth
            className={classes.textField}
          />
          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            rowsMax={4}
            value={desc || ""}
            onChange={handleDescChange}
            fullWidth
            className={classes.textField}
          />
          <TextField
            id="standard-textarea"
            label="Comments"
            placeholder="Add your Comments"
            multiline
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            onClick={() => {
              comment && handleAddComment(comment);
              setComment("");
            }}
            variant="contained"
            color="primary"
          >
            Add Comment
          </Button>
        </DialogContent>
        {task.comments.length > 0 && (
          <div className={classes.commentList}>
            <Typography className={classes.commentTitle}>Comments</Typography>
            {task.comments.map((comment, i) => {
              return (
                <DialogContentText className={classes.comment} key={i}>
                  {comment.comment}
                  <span className={classes.commentDate}>{comment.date}</span>
                </DialogContentText>
              );
            })}
          </div>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSave(name, desc);
            }}
            color="primary"
            disabled={!name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

EditTaskFormDialog.propTypes = {
  handleAddComment: PropTypes.func,
  handleClose: PropTypes.any,
  handleSave: PropTypes.func,
  open: PropTypes.bool,
  task: PropTypes.shape({
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
        date: PropTypes.string,
      })
    ),
    description: PropTypes.string,
    name: PropTypes.string,
  }),
};
